"""Scheduled ESPN snapshot ingestion; stdlib only. No secrets, AI or betting actions."""
import argparse,copy,datetime,json,os,subprocess,time,urllib.request,urllib.parse
from pathlib import Path
from zoneinfo import ZoneInfo
UTC=datetime.timezone.utc
ATHENS=ZoneInfo('Europe/Athens')
LEAGUES={'eng.1':'Premier League','fra.1':'Ligue 1','ger.1':'Bundesliga','esp.1':'La Liga','ita.1':'Serie A','eng.2':'EFL Championship','esp.2':'La Liga 2','ger.2':'2. Bundesliga','ned.1':'Eredivisie'}
ALIASES={'eng.1':{'Premier League'},'fra.1':{'Ligue 1'},'ger.1':{'Bundesliga'},'esp.1':{'LALIGA'},'ita.1':{'Serie A'},'eng.2':{'EFL Championship'},'esp.2':{'LALIGA 2'},'ger.2':{'2. Bundesliga'},'ned.1':{'Eredivisie'}}
def dt(value):return datetime.datetime.fromisoformat(value.replace('Z','+00:00'))
def stamp(now):return now.astimezone(UTC).isoformat().replace('+00:00','Z')
def fetch(url):
 for attempt in range(3):
  try:
   req=urllib.request.Request(url,headers={'User-Agent':'PitchLab/0.5 (public football research snapshots)'})
   with urllib.request.urlopen(req,timeout=30) as r:return json.load(r)
  except Exception:
   if attempt==2:raise
   time.sleep(attempt+1)
def event_id(entry):
 if entry.get('providerEventId'):return entry['providerEventId']
 for s in entry.get('researchSources',[]):
  value=urllib.parse.parse_qs(urllib.parse.urlsplit(s['url']).query).get('event')
  if value:return value[0]
 return None
def settle(entry,event,url,now):
 """Only completed post-game scores settle; scheduled0-0 and postponed games stay pending."""
 status=event.get('status',{}).get('type',{});entry['providerStatus']=status.get('name','unknown')
 if not(status.get('state')=='post' and status.get('completed') is True):return False
 if dt(event['date'])>now:raise ValueError('Provider reports a final score before kickoff; review needed')
 cs={c['homeAway']:c for c in event['competitions'][0]['competitors']};expected={t['side']:t['teamId'] for t in entry.get('research',{}).get('teams',[])}
 if any(expected.get(side) and expected[side]!=cs[side]['id'] for side in ['home','away']):raise ValueError('Fixture team-ID mismatch: '+entry['id'])
 if any('score' not in cs[s] or not str(cs[s]['score']).isdigit() for s in ['home','away']):raise ValueError('Missing final score')
 h,a=int(cs['home']['score']),int(cs['away']['score'])
 if max(h,a)>30:raise ValueError('Unexpected final score; review needed')
 if entry.get('settled') and (entry['hg'],entry['ag'])!=(h,a):raise ValueError('Score correction needs review')
 entry.update(settled=True,hg=h,ag=a,resultSource=url,resultCheckedAt=stamp(now),outcome='home' if h>a else 'draw' if h==a else 'away');return True
def facts(code,event,summary,now):
 teams={c['homeAway']:c for c in event['competitions'][0]['competitors']};rows=[];warnings=[];counts=[]
 for side in ['home','away']:
  c=teams[side];table=next((t for g in summary.get('standings',{}).get('groups',[]) for t in g.get('standings',{}).get('entries',[]) if t['id']==c['id']),None);stats={x['name']:x['value'] for x in table['stats'] if isinstance(x.get('value'),(int,float))} if table else {};recent=next((t for t in summary.get('lastFiveGames',[]) if t['team']['id']==c['id']),{});games=[];gf=ga=0;n=0
  for g in recent.get('events',[]):
   if dt(g['gameDate'])>=now or not all(str(g.get(k,'')).isdigit() for k in ['homeTeamScore','awayTeamScore']):continue
   games.append({'date':g['gameDate'],'opponent':g['opponent']['displayName'],'homeGoals':g['homeTeamScore'],'awayGoals':g['awayTeamScore'],'homeTeamId':g['homeTeamId'],'awayTeamId':g['awayTeamId'],'competition':g.get('competitionName',g.get('leagueName',''))})
   if g.get('leagueAbbreviation') not in ALIASES[code]:continue
   h,a=int(g['homeTeamScore']),int(g['awayTeamScore']);gf+=h if g['homeTeamId']==c['id'] else a;ga+=a if g['homeTeamId']==c['id'] else h;n+=1
  rows.append(dict(side=side,name=c['team']['displayName'],teamId=c['id'],table=stats,recentMatches=games));counts.append(dict(games=n,goalsFor=gf,goalsAgainst=ga))
  if stats and stats.get('points')!=3*stats.get('wins',0)+stats.get('ties',0):warnings.append(c['team']['displayName']+': source table points disagree with W-D-L; not used for Poisson.')
 return teams,rows,counts,warnings
def new_entry(code,event,summary,now,root):
 if event.get('status',{}).get('type',{}).get('state')!='pre' or dt(event['date'])<=now+datetime.timedelta(minutes=30):return None
 teams,rows,counts,warnings=facts(code,event,summary,now);url=f'https://site.api.espn.com/apis/site/v2/sports/soccer/{code}/summary?event='+event['id'];day=dt(event['date']).astimezone(ATHENS).date().isoformat();recorded=stamp(now)
 p=dict(id='espn-'+code+'-'+event['id'],providerEventId=event['id'],day=day,league=LEAGUES[code],home=teams['home']['team']['displayName'],away=teams['away']['team']['displayName'],kickoff=event['date'],recordedAt=recorded,fixtureConfirmed=True,fixtureSource=url,model='Elo65-draw28-v1; initial1500 ratings for both teams',homeP=.4265756860207189,drawP=.28,awayP=.2934243139792811,settled=False,researchStatus='Automated fixture/table/recent-score snapshot; no human selection or confirmed injury/lineup news.',researchSources=[dict(title='ESPN event summary and standings',url=url,checkedAt=recorded)],research=dict(checkedAt=recorded,teams=rows,limitations=['Single main provider.','No verified injuries or final lineups.','Poisson uses a small league-only sample; generic priors, no calibration.']+warnings,newsCheck='This automated job does not research narrative news or generate an AI opinion.'))
 if min(x['games'] for x in counts)>=3:
  codejs="const p=require('./apps/pitchlab/poisson.js'),x=JSON.parse(process.argv[1]);console.log(JSON.stringify(p.estimate(x[0],x[1])))";a=json.loads(subprocess.check_output(['node','-e',codejs,json.dumps(counts)],cwd=root,text=True));a.update(recordedAt=recorded,pick=max(['home','draw','away'],key=lambda k:a[k+'P']),limitations='Small league-only sample; generic unfitted priors; no injuries, opponent adjustment or calibration.');p['algorithmForecast']=a
 return p
def update(data,now,mode,get=fetch,root=None):
 result=copy.deepcopy(data);entries=result['entries'];today=now.astimezone(ATHENS).date();reverse={v:k for k,v in LEAGUES.items()};cache={};requests=[];summaries={}
 def summary(code,eid):
  key=(code,eid)
  if key not in summaries:summaries[key]=get(f'https://site.api.espn.com/apis/site/v2/sports/soccer/{code}/summary?event='+eid)
  return summaries[key]
 def scoreboard(code,day):
  key=(code,day)
  if key not in cache:
   url=f'https://site.api.espn.com/apis/site/v2/sports/soccer/{code}/scoreboard?dates='+day.replace('-','');cache[key]=get(url);requests.append(url)
  return cache[key]
 # Bounded catch-up: older unresolved records remain pending for manual review.
 for p in entries:
  age=(today-datetime.date.fromisoformat(p['day'])).days
  if p.get('settled') or not(0<=age<=7) or p['league'] not in reverse:continue
  code=reverse[p['league']];events=scoreboard(code,p['day']).get('events',[]);eid=event_id(p);event=next((e for e in events if e['id']==eid),None)
  if event:
   settle(p,event,f'https://site.api.espn.com/apis/site/v2/sports/soccer/{code}/scoreboard?dates='+p['day'].replace('-',''),now)
   if event.get('status',{}).get('type',{}).get('state')=='pre' and dt(event['date'])>now:
    snap=summary(code,eid);offers=snap.get('pickcenter') or snap.get('odds') or []
    if offers:
     o=offers[0];values=[o.get('homeTeamOdds',{}).get('moneyLine'),o.get('drawOdds',{}).get('moneyLine'),o.get('awayTeamOdds',{}).get('moneyLine')]
     if all(isinstance(v,(int,float)) and abs(v)>=100 for v in values):p.setdefault('marketSnapshots',[]).append(dict(observedAt=stamp(now),provider=o.get('provider',{}).get('name','Unknown'),homeOdds=1+values[0]/100 if values[0]>0 else 1+100/abs(values[0]),drawOdds=1+values[1]/100 if values[1]>0 else 1+100/abs(values[1]),awayOdds=1+values[2]/100 if values[2]>0 else 1+100/abs(values[2]),source=f'https://site.api.espn.com/apis/site/v2/sports/soccer/{code}/summary?event='+eid,providerUpdatedAt=None,note='Observed source snapshot; no executable-price or closing-line claim.'))
 added=[];pool=[]
 if mode=='daily':
  candidates=[];known={event_id(p) for p in entries};day=today.isoformat();remaining=max(0,10-sum(p['day']==day for p in entries))
  for priority,code in enumerate(LEAGUES):
   for e in scoreboard(code,day).get('events',[]):
    if dt(e['date']).astimezone(ATHENS).date()!=today or e.get('status',{}).get('type',{}).get('state')!='pre' or dt(e['date'])<=now+datetime.timedelta(minutes=30):continue
    pool.append(dict(eventId=e['id'],league=code,kickoff=e['date']))
    if e['id'] not in known:candidates.append((priority,e['date'],e['id'],code,e))
  for _,_,_,code,e in sorted(candidates)[:remaining]:
   snapshot=summary(code,e['id']);p=new_entry(code,e,snapshot,now,root)
   if p:entries.append(p);added.append(p['id'])
 result['updatedAt']=stamp(now);result['automation']={'status':'success','lastSuccessAt':stamp(now),'lastMode':mode,'timezone':'Europe/Athens','selectionRule':'Up to10 per Athens day; fixed league priority, then kickoff/event ID; at least30min before kickoff. Not confidence-based selection.','lastAdded':added,'candidatePool':pool,'scheduleUTC':['07:17 daily selection + results','16:17 results + pre-match price observations','23:17 results only'],'source':'ESPN public data endpoint; availability not guaranteed; no paid plan or AI calls','historicalCatchupDays':7}
 result['notice']='Automatic daily snapshots and final-score checks are scheduled. Original forecasts are retained; research opinions are separate from unfitted experimental Poisson. No automatic narrative-news/lineup research, calibrated accuracy or betting-profit claim. See last successful update; schedules may be delayed.'
 return result
if __name__=='__main__':
 ap=argparse.ArgumentParser();ap.add_argument('--mode',choices=['daily','results'],default='daily');ap.add_argument('--ledger',default='apps/pitchlab/daily.json');args=ap.parse_args();root=Path(__file__).resolve().parents[1];p=root/args.ledger;data=json.loads(p.read_text());out=update(data,datetime.datetime.now(UTC),args.mode,root=root);tmp=p.with_suffix('.json.tmp');tmp.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');os.replace(tmp,p);print('Snapshot saved:',len(out['entries']),'entries; added',len(out['automation']['lastAdded']))
