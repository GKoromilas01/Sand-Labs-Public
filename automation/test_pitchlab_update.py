import unittest,copy,datetime
from pitchlab_update import settle,update,UTC
NOW=datetime.datetime(2026,11,27,21,tzinfo=UTC)
class UpdateTests(unittest.TestCase):
 def entry(self):return dict(id='a',day='2026-11-27',league='Premier League',providerEventId='e',kickoff='2026-11-27T20:00Z',settled=False,recordedAt='2026-11-27T10:00Z',homeP=.4,drawP=.3,awayP=.3,research={'teams':[{'side':'home','teamId':'1'},{'side':'away','teamId':'2'}]})
 def event(self,completed=False):return {'id':'e','date':'2026-11-27T20:00Z','status':{'type':{'state':'post' if completed else 'pre','completed':completed}},'competitions':[{'competitors':[{'homeAway':'home','id':'1','score':'0'},{'homeAway':'away','id':'2','score':'0'}]}]}
 def test_scheduled_zero_is_not_final(self):
  p=self.entry();self.assertFalse(settle(p,self.event(),'',NOW));self.assertFalse(p['settled'])
 def test_completed_draw_keeps_forecast(self):
  p=self.entry();old=copy.deepcopy(p);self.assertTrue(settle(p,self.event(True),'source',NOW));self.assertEqual(p['hg'],0)
  for k in ['recordedAt','homeP','drawP','awayP']:self.assertEqual(p[k],old[k])
 def test_fixture_mismatch_rejected(self):
  e=self.event(True);e['competitions'][0]['competitors'][0]['id']='other';self.assertRaises(ValueError,settle,self.entry(),e,'',NOW)
 def test_results_update_and_repeat_does_not_duplicate(self):
  get=lambda u:{'events':[self.event(True)]};data={'entries':[self.entry()]};a=update(data,NOW,'results',get);b=update(a,NOW,'results',get);self.assertEqual(len(b['entries']),1);self.assertFalse(data['entries'][0]['settled']);self.assertTrue(b['entries'][0]['settled'])
 def test_empty_daily_does_not_invent_fixtures(self):
  out=update({'entries':[]},NOW,'daily',lambda u:{'events':[]});self.assertEqual(out['entries'],[])
 def test_fetch_failure_does_not_modify_input(self):
  data={'entries':[self.entry()]};old=copy.deepcopy(data)
  def bad(u):raise OSError('network unavailable')
  self.assertRaises(OSError,update,data,NOW,'results',bad);self.assertEqual(data,old)
 def test_daily_caps_at_ten_and_does_not_duplicate(self):
  now=NOW.replace(hour=12)
  def get(url):
   if 'summary?' in url:return {}
   if '/eng.1/' not in url:return {'events':[]}
   events=[]
   for i in range(12):
    e=self.event();e['id']=str(i);e['competitions'][0]['competitors'][0]['team']={'displayName':'A'+str(i)};e['competitions'][0]['competitors'][1]['team']={'displayName':'B'+str(i)};events.append(e)
   return {'events':events}
  a=update({'entries':[]},now,'daily',get);self.assertEqual(len(a['entries']),10);b=update(a,now,'daily',get);self.assertEqual(len(b['entries']),10)
 def test_future_final_is_rejected(self):
  self.assertRaises(ValueError,settle,self.entry(),self.event(True),'',NOW.replace(hour=12))
if __name__=='__main__':unittest.main()
