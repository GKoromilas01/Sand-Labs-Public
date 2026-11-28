/* Original painted island scenery. SVG inner markup; the game supplies Pavlos. */
(function(root){'use strict';
const square=`
<defs>
 <linearGradient id="sq_sky" x2="0" y2="1"><stop stop-color="#82b8b9"/><stop offset="1" stop-color="#dbe3c6"/></linearGradient>
 <linearGradient id="sq_wall" x2="0" y2="1"><stop stop-color="#f4e3ba"/><stop offset="1" stop-color="#d1bb8b"/></linearGradient>
 <pattern id="sq_paving" width="142" height="74" patternUnits="userSpaceOnUse"><rect width="142" height="74" fill="#b9b8a0"/><path d="M0 0H142V74H0ZM71 0V37M0 37H142M35 37V74M108 37V74" fill="none" stroke="#ded7b8" stroke-width="3"/></pattern>
</defs>
<rect width="1200" height="620" fill="url(#sq_sky)"/>
<circle cx="988" cy="87" r="43" fill="#f5de9f" opacity=".8"/>
<path d="M0 230L115 171 220 201 339 141 450 185 590 137 742 196 880 153 1008 197 1200 140V390H0Z" fill="#8eaa98"/>
<!-- The village houses lean gently, like the cafe's painted furniture. -->
<path d="M-15 192L213 165 229 448H0Z" fill="url(#sq_wall)" stroke="#806e51" stroke-width="4"/>
<path d="M-15 190L93 130 223 166 229 190Z" fill="#ac6d4d" stroke="#805235" stroke-width="5"/>
<path d="M26 239H91V325H26ZM132 219H189V302H132Z" fill="#557b72" stroke="#345c56" stroke-width="5"/>
<path d="M58 242V321M160 222V300" stroke="#91a98b" stroke-width="3"/>
<path d="M57 447V373Q89 332 122 371V447Z" fill="#497388" stroke="#34535b" stroke-width="5"/>
<path d="M421 163L662 174V445H424Z" fill="#e9d8ac" stroke="#9a8764" stroke-width="4"/>
<path d="M406 163L534 111 677 171" fill="#bc8157" stroke="#805235" stroke-width="8"/>
<path d="M463 210H510V278H463ZM573 217H620V285H573Z" fill="#698c87" stroke="#3b635d" stroke-width="5"/>
<path d="M519 443V354Q545 315 574 354V443Z" fill="#805235" stroke="#5e4837" stroke-width="5"/>
<path d="M730 183L913 178 921 444H733Z" fill="#f0e4c3" stroke="#9a8764" stroke-width="4"/>
<path d="M754 179V105Q778 57 803 105V179" fill="#f0e4c3" stroke="#9a8764" stroke-width="5"/>
<path d="M768 116Q779 94 790 116V144H768Z" fill="#557b72"/>
<path d="M780 62V86M769 72H791" stroke="#805235" stroke-width="5"/>
<path d="M786 444V345Q823 300 859 345V444" fill="#517e86" stroke="#385c60" stroke-width="5"/>
<path d="M0 434Q302 414 607 435T1200 426V620H0Z" fill="url(#sq_paving)"/>
<path d="M0 442Q360 420 690 445T1200 434" fill="none" stroke="#ded7b8" stroke-width="12"/>
<!-- Weathered notice kiosk, with its one readable festival poster. -->
<g transform="translate(290 172)">
 <path d="M22 64V278M154 65V275" stroke="#6e5038" stroke-width="13"/>
 <path d="M0 40L80 0 179 38 174 54H5Z" fill="#557b72" stroke="#345c56" stroke-width="5"/>
 <path d="M19 60L160 57 155 233 21 239Z" fill="#805235" stroke="#5a4433" stroke-width="5"/>
 <path d="M40 76L144 80 138 217 44 214 48 187 40 174Z" fill="#f4e1ad" stroke="#b58f58" stroke-width="2"/>
 <path d="M50 105H132M55 180H128" stroke="#ba6448" stroke-width="3"/>
 <text x="93" y="99" text-anchor="middle" fill="#3e665c" font-size="12" font-weight="bold">ΠΑΝΗΓΥΡΙ</text>
 <text x="93" y="128" text-anchor="middle" fill="#805235" font-size="10">ΑΠΟΨΕ ΕΔΩ</text>
 <path d="M75 158Q62 144 80 139Q101 134 104 152L94 167Z" fill="#ba8048" stroke="#805235" stroke-width="2"/>
 <path d="M94 146L119 132" stroke="#805235" stroke-width="5"/>
 <text x="93" y="197" text-anchor="middle" fill="#3e665c" font-size="8">ΖΗΤΟΥΝΤΑΙ ΟΜΙΛΗΤΕΣ</text>
 <circle cx="94" cy="84" r="3" fill="#805235"/>
</g>
<!-- Fountain sits behind the clear foreground walking strip. -->
<ellipse cx="875" cy="453" rx="131" ry="23" fill="#637d71" opacity=".25"/>
<path d="M765 410Q875 385 984 410L966 451Q875 475 782 451Z" fill="#9bafaa" stroke="#557b72" stroke-width="5"/>
<ellipse cx="875" cy="410" rx="109" ry="24" fill="#75a8aa" stroke="#557b72" stroke-width="5"/>
<path d="M851 404L860 320H891L902 404Z" fill="#d8d6b7" stroke="#788e7e" stroke-width="4"/>
<path d="M823 310Q875 298 928 310L914 330Q875 344 838 329Z" fill="#d8d6b7" stroke="#788e7e" stroke-width="4"/>
<path d="M858 308Q875 266 891 308M849 332Q830 356 818 405M901 332Q919 365 929 403" fill="none" stroke="#cae5d7" stroke-width="4" stroke-linecap="round"/>
<!-- Plane tree and pots frame the square without blocking the walk band. -->
<path d="M1080 442L1070 248 1031 177M1074 299L1132 196" fill="none" stroke="#805235" stroke-width="24"/>
<path d="M1001 224Q929 196 975 139Q959 85 1020 92Q1061 34 1108 85Q1171 59 1183 122Q1247 163 1194 211Q1151 248 1107 221Q1056 253 1001 224Z" fill="#557b72" stroke="#3e665c" stroke-width="5"/>
<path d="M1021 135Q1066 101 1102 132M1115 177Q1153 136 1182 164" fill="none" stroke="#799678" stroke-width="9" stroke-linecap="round"/>
<path d="M179 430H228L218 466H190Z" fill="#ac6d4d" stroke="#805235" stroke-width="3"/>
<path d="M202 433Q169 395 189 376Q205 388 207 414Q215 371 233 383Q246 410 211 433" fill="#678b68"/>
<path d="M0 612H1200" stroke="#293e36" stroke-width="16"/>`;
const harbor=`
<defs>
 <linearGradient id="hb_sky" x2="0" y2="1"><stop stop-color="#85b7bb"/><stop offset="1" stop-color="#e4e5c7"/></linearGradient>
 <linearGradient id="hb_sea" x2="0" y2="1"><stop stop-color="#548d98"/><stop offset="1" stop-color="#386f7b"/></linearGradient>
 <pattern id="hb_stone" width="180" height="62" patternUnits="userSpaceOnUse"><rect width="180" height="62" fill="#bdbaa0"/><path d="M0 0H180V62H0ZM90 0V31M0 31H180M40 31V62M140 31V62" fill="none" stroke="#e0d8b6" stroke-width="3"/></pattern>
</defs>
<rect width="1200" height="620" fill="url(#hb_sky)"/>
<circle cx="194" cy="88" r="42" fill="#f4dfa9" opacity=".85"/>
<path d="M0 224L58 200 137 211 226 163 319 193 385 174 464 220 560 237H0ZM656 235L727 199 802 214 884 175 969 211 1053 195 1200 231V263H656Z" fill="#93aca2"/>
<path d="M0 251L120 226 224 245 358 223 477 247 657 253 789 241 929 253 1070 232 1200 251V282H0Z" fill="#7a9e98"/>
<rect y="260" width="1200" height="237" fill="url(#hb_sea)"/>
<g fill="none" stroke="#b1d1c3" stroke-width="3" opacity=".6"><path d="M45 286H157M228 307H329M510 281H607M786 296H899M1028 278H1152M79 357H231M438 376H576M957 367H1121M35 408H127M665 428H793M914 423H1049"/><path d="M304 336Q340 327 371 336M689 350Q728 341 764 350"/></g>
<!-- Whitewashed harbour warehouse and one quiet sailboat. -->
<path d="M0 159L204 183V443H0Z" fill="#e9d8ac" stroke="#97815d" stroke-width="5"/>
<path d="M0 146L219 174 214 198 0 172Z" fill="#a76b4b" stroke="#805235" stroke-width="5"/>
<path d="M30 273H117V432H30Z" fill="#557b72" stroke="#345c56" stroke-width="5"/>
<path d="M46 283V422M67 283V422M88 283V422M107 283V422" stroke="#79988a" stroke-width="3"/>
<rect x="134" y="224" width="48" height="63" fill="#658e91" stroke="#3d666b" stroke-width="5"/>
<path d="M128 217H188M129 295H188" stroke="#e9e1ba" stroke-width="6"/>
<text x="84" y="240" text-anchor="middle" fill="#805235" font-size="12" letter-spacing="2">ΑΠΟΘΗΚΗ</text>
<g transform="translate(733 367)">
 <ellipse cx="2" cy="55" rx="171" ry="14" fill="#2c5964" opacity=".35"/>
 <path d="M-151 14Q-53 37 157 6L119 58Q12 87-114 50Z" fill="#e9d8ac" stroke="#345c56" stroke-width="6"/>
 <path d="M-143 28Q-10 54 144 24L135 39Q-1 72-127 41Z" fill="#557b72"/>
 <path d="M-11 16L-4-244" stroke="#805235" stroke-width="8"/>
 <path d="M-1-233L-1-16 133-23Q105-103-1-233Z" fill="#f5e7bf" stroke="#ae9a71" stroke-width="3"/>
 <path d="M-16-207L-21-20-118-9Z" fill="#dfcd9e" stroke="#ae9a71" stroke-width="3"/>
 <path d="M-2-244L43-231 0-219Z" fill="#ac6d4d"/>
 <path d="M-14-14H132M-119-3H-17" stroke="#805235" stroke-width="5"/>
 <path d="M-115 35L-232 96" stroke="#a79467" stroke-width="4"/>
 <text x="38" y="49" text-anchor="middle" fill="#f4e3ba" font-size="11">ΥΠΟΜΟΝΗ</text>
</g>
<!-- The quay's front edge opens a broad unobstructed walking band. -->
<path d="M0 444L1200 455V620H0Z" fill="url(#hb_stone)"/>
<path d="M0 438L1200 448V468L0 459Z" fill="#e9d8ac" stroke="#8b967f" stroke-width="4"/>
<g fill="#557b72" stroke="#345c56" stroke-width="4"><path d="M474 429H506L514 465H468Z"/><path d="M1004 436H1032L1040 470H998Z"/></g>
<path d="M1020 438Q1123 464 1194 430" fill="none" stroke="#ae9867" stroke-width="5"/>
<!-- Gull on the short mooring post: comic, original, and slightly disapproving. -->
<path d="M1076 427L1074 354H1103L1106 429Z" fill="#805235" stroke="#5e4837" stroke-width="5"/>
<path d="M1082 355V419M1095 358V421" stroke="#ac8157" stroke-width="3"/>
<g transform="translate(1087 333)">
 <path d="M-9 20L-12 2M7 20L10 1" stroke="#ac8157" stroke-width="3"/>
 <path d="M-12 21H-22M7 21H18" stroke="#ac8157" stroke-width="3"/>
 <path d="M-34-4Q-23-30 5-22Q11-51 33-39Q43-30 34-16L18-1Q-7 20-34-4Z" fill="#f3e8c8" stroke="#68867e" stroke-width="3"/>
 <path d="M-26-5Q-12-22 9-12L-4 3Z" fill="#a1b4a5"/>
 <path d="M35-33L57-25 34-21Z" fill="#c79d50" stroke="#94723c" stroke-width="2"/>
 <circle cx="28" cy="-32" r="3" fill="#293e36"/>
 <path d="M-33-4L-51-15-43 4Z" fill="#557b72"/>
</g>
<path d="M932 128Q944 114 956 127Q969 114 980 125M438 100Q448 90 459 100Q469 88 481 99" fill="none" stroke="#557b72" stroke-width="3" stroke-linecap="round"/>
<path d="M0 612H1200" stroke="#293e36" stroke-width="16"/>`;
const hall=`<rect width="1200" height="620" fill="#e8d5a8"/><rect y="455" width="1200" height="165" fill="#a99065"/><path d="M0 455H1200M0 510H1200M0 565H1200" stroke="#c7b386" stroke-width="4"/><rect x="280" y="80" width="700" height="350" rx="10" fill="#375b55" stroke="#8f6947" stroke-width="16"/><path d="M280 90Q440 250 310 420M980 90Q820 250 950 420" fill="#ab6648" stroke="#805235" stroke-width="20"/><rect x="280" y="420" width="700" height="50" fill="#805235"/><text x="630" y="125" text-anchor="middle" fill="#f0dfb7" font-size="27">COMMUNITY HALL</text><path d="M650 220V417M615 418H685" stroke="#d3c39c" stroke-width="8"/><ellipse cx="650" cy="209" rx="20" ry="34" fill="#243b39" stroke="#c7b386" stroke-width="6"/><path d="M650 240Q750 330 795 425" fill="none" stroke="#293e36" stroke-width="5"/><path d="M890 330H1010L990 450H909Z" fill="#b68c5c" stroke="#805235" stroke-width="6"/><rect x="52" y="128" width="153" height="248" fill="#517c78" stroke="#805235" stroke-width="8"/><path d="M52 252H205M128 128V376" stroke="#dbc99d" stroke-width="6"/><g fill="#557b72" stroke="#345c56" stroke-width="5"><path d="M440 500H520V555H440ZM600 500H680V555H600ZM760 500H840V555H760Z"/></g>`;
const backstage=`<rect width="1200" height="620" fill="#cbbb91"/><rect y="445" width="1200" height="175" fill="#8e805e"/><path d="M0 445H1200M0 510H1200M0 570H1200" stroke="#b6a67d" stroke-width="5"/><text x="600" y="75" fill="#375b55" text-anchor="middle" font-size="30">BACKSTAGE</text><rect x="540" y="120" width="420" height="320" fill="#36554e" stroke="#805235" stroke-width="12"/><path d="M540 120Q710 260 640 438H540ZM960 120Q790 260 860 438H960Z" fill="#ab6648" stroke="#805235" stroke-width="8"/><path d="M540 110H960" stroke="#d8bf88" stroke-width="12"/><rect x="700" y="210" width="110" height="150" transform="rotate(-7 750 280)" fill="#f6e7bb"/><path d="M722 245H788M720 272H785M720 299H775" stroke="#9f704a" stroke-width="5"/><path d="M90 180H400M90 300H400M110 160V445M380 160V445" stroke="#805235" stroke-width="14"/><ellipse cx="240" cy="270" rx="70" ry="22" fill="none" stroke="#314d46" stroke-width="11"/><path d="M300 270L350 300" stroke="#314d46" stroke-width="8"/><rect x="950" y="415" width="190" height="120" fill="#a88154" stroke="#5f503c" stroke-width="6"/><path d="M960 425L1130 525M1130 425L960 525" stroke="#735d40" stroke-width="8"/>`;
const rooms={
 hall:{name:'Community hall',actions:['microphone','lectern','festival'],spots:{},spawn:{x:379,y:558},art:hall},
 backstage:{name:'Backstage',actions:['cable','curtain'],spots:{},spawn:{x:379,y:558},art:backstage},
 cafe:{name:'Το καφενείο του Μήτσου',actions:['mitsos','radio','spoon','grinder','ledger','speech','tools'],spots:{radio:{x:470,y:249,w:167,h:120},mitsos:{x:790,y:140,w:170,h:180},spoon:{x:710,y:300,w:95,h:55},ledger:{x:1020,y:280,w:110,h:80}},spawn:{x:379,y:558},art:null},
 square:{name:'Η πλατεία του χωριού',actions:['poster','clerk','fountain'],spots:{poster:{x:328,y:244,w:108,h:150},fountain:{x:760,y:278,w:230,h:188}},spawn:{x:379,y:558},art:square},
 harbor:{name:'Το μικρό λιμάνι',actions:['key','boat','gull','rope','supplies'],spots:{boat:{x:579,y:122,w:317,h:310},gull:{x:1034,y:282,w:116,h:76}},spawn:{x:379,y:558},art:harbor}
};
const api={rooms};root.PavlosWorld=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
