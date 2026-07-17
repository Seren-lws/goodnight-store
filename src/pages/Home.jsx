import { useNavigate } from 'react-router-dom';
import NightCanvas from '../components/NightCanvas';
import './Home.css';

export default function Home() {
  const nav = useNavigate();

  return (
    <div className="home-page">
      <NightCanvas />

      <div className="store-wrap">
        <svg
          className="store-scene"
          viewBox="0 0 300 336"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="晚安便利店店面"
        >
          <defs>
            <linearGradient id="warmWindow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5e4839" />
              <stop offset="100%" stopColor="#3c2e50" />
            </linearGradient>
            <radialGradient id="lampGlow" cx="50%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#ffd9a0" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ffd9a0" stopOpacity="0" />
            </radialGradient>
            <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 店体 */}
          <rect x="0" y="46" width="300" height="256" rx="10" fill="#221c3e" />

          {/* 招牌带 */}
          <rect x="0" y="46" width="300" height="44" rx="10" fill="#1c1736" />
          <circle className="bulb" cx="16" cy="68" r="2.2" />
          <circle className="bulb bulb-d" cx="284" cy="68" r="2.2" />
          <text className="sign-text" x="150" y="77" textAnchor="middle" filter="url(#softGlow)">
            晚安便利店
          </text>

          {/* 雨棚 */}
          <g opacity="0.65">
            {Array.from({ length: 7 }).map((_, i) => (
              <path
                key={i}
                d={`M ${1 + i * 42.6} 90 a 21.3 12 0 0 0 42.6 0 Z`}
                fill={i % 2 === 0 ? '#6f639c' : '#a68a68'}
              />
            ))}
          </g>

          {/* 橱窗 */}
          <rect x="16" y="118" width="150" height="146" rx="8" fill="#161129" stroke="#332b52" strokeWidth="2.5" />
          <rect className="window-light" x="21" y="123" width="140" height="136" rx="6" fill="url(#warmWindow)" />
          <rect x="21" y="123" width="140" height="136" rx="6" fill="url(#lampGlow)" />
          <rect x="88" y="123" width="5" height="136" fill="#332b52" />
          <rect x="14" y="264" width="154" height="7" rx="3.5" fill="#3f3560" />

          {/* 橱窗左：书架（故事柜） */}
          <g className="hotspot" onClick={() => nav('/story')} role="button" aria-label="故事柜">
            <rect x="28" y="168" width="54" height="4" rx="2" fill="#3f3560" />
            <rect x="28" y="212" width="54" height="4" rx="2" fill="#3f3560" />
            <rect x="30" y="146" width="8" height="22" rx="1.5" fill="#b57f95" />
            <rect x="40" y="149" width="7" height="19" rx="1.5" fill="#7bc4ae" />
            <rect x="49" y="147" width="8" height="21" rx="1.5" fill="#9d8cc9" />
            <rect x="59" y="150" width="7" height="18" rx="1.5" fill="#d9ab72" />
            <rect x="68" y="148" width="8" height="20" rx="1.5" fill="#7d97c2" transform="rotate(8 72 168)" />
            <rect x="30" y="191" width="7" height="21" rx="1.5" fill="#d9ab72" />
            <rect x="39" y="194" width="8" height="18" rx="1.5" fill="#7d97c2" />
            <rect x="49" y="190" width="7" height="22" rx="1.5" fill="#b57f95" />
            <rect x="58" y="193" width="8" height="19" rx="1.5" fill="#7bc4ae" />
            <rect x="68" y="192" width="7" height="20" rx="1.5" fill="#9d8cc9" transform="rotate(-7 71 212)" />
            <line x1="55" y1="271" x2="55" y2="279" stroke="#7a6a50" strokeWidth="1.2" />
            <rect x="39" y="279" width="32" height="17" rx="4" fill="#e8d9ba" />
            <text className="tag-text" x="55" y="291" textAnchor="middle">故事</text>
            <rect x="16" y="118" width="75" height="182" fill="transparent" />
            <title>故事柜</title>
          </g>

          {/* 橱窗右：收音机（声音角） */}
          <g className="hotspot" onClick={() => nav('/sounds')} role="button" aria-label="声音角">
            <rect x="99" y="222" width="54" height="6" rx="3" fill="#3f3560" />
            <rect x="104" y="228" width="5" height="22" fill="#3f3560" />
            <rect x="143" y="228" width="5" height="22" fill="#3f3560" />
            <line x1="141" y1="188" x2="152" y2="167" stroke="#9d92b8" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="152" cy="166" r="1.8" fill="#9d92b8" />
            <rect x="103" y="188" width="46" height="34" rx="7" fill="#b57f95" />
            <circle cx="117" cy="205" r="8.5" fill="#1c1736" />
            <line x1="113" y1="202" x2="121" y2="202" stroke="#4a3f68" strokeWidth="1.2" />
            <line x1="112" y1="205" x2="122" y2="205" stroke="#4a3f68" strokeWidth="1.2" />
            <line x1="113" y1="208" x2="121" y2="208" stroke="#4a3f68" strokeWidth="1.2" />
            <rect x="131" y="194" width="11" height="7" rx="2.5" fill="#e8c491" />
            <circle cx="136" cy="211" r="2.8" fill="#1c1736" />
            <text className="note-float" x="158" y="184">♪</text>
            <text className="note-float note-float-d" x="167" y="198">♩</text>
            <line x1="126" y1="271" x2="126" y2="279" stroke="#7a6a50" strokeWidth="1.2" />
            <rect x="110" y="279" width="32" height="17" rx="4" fill="#e8d9ba" />
            <text className="tag-text" x="126" y="291" textAnchor="middle">声音</text>
            <rect x="91" y="118" width="75" height="182" fill="transparent" />
            <title>声音角</title>
          </g>

          {/* 便签板（便签墙） */}
          <g className="hotspot" onClick={() => nav('/notes')} role="button" aria-label="便签墙">
            <rect x="182" y="118" width="102" height="80" rx="7" fill="#2e2750" stroke="#3f3560" strokeWidth="2.5" />
            <rect x="192" y="128" width="21" height="21" rx="2.5" fill="#e8c491" transform="rotate(-5 202 138)" />
            <rect x="221" y="131" width="21" height="21" rx="2.5" fill="#dba3b0" transform="rotate(6 231 141)" />
            <rect x="250" y="127" width="20" height="20" rx="2.5" fill="#a3cbbd" transform="rotate(-4 260 137)" />
            <rect x="199" y="158" width="21" height="21" rx="2.5" fill="#b3a5d9" transform="rotate(4 209 168)" />
            <rect x="230" y="160" width="20" height="20" rx="2.5" fill="#e8c491" transform="rotate(-6 240 170)" />
            <circle cx="202" cy="131" r="1.6" fill="#7a6a50" />
            <circle cx="231" cy="134" r="1.6" fill="#7a6a50" />
            <circle cx="260" cy="130" r="1.6" fill="#7a6a50" />
            <line x1="233" y1="198" x2="233" y2="205" stroke="#7a6a50" strokeWidth="1.2" />
            <rect x="217" y="205" width="32" height="17" rx="4" fill="#e8d9ba" />
            <text className="tag-text" x="233" y="217" textAnchor="middle">便签</text>
            <title>便签墙</title>
          </g>

          {/* 店长室的门（设置） */}
          <g className="hotspot" onClick={() => nav('/settings')} role="button" aria-label="设置">
            <rect x="182" y="230" width="102" height="72" rx="7" fill="#292250" stroke="#3f3560" strokeWidth="2.5" />
            <circle cx="233" cy="258" r="13" fill="url(#warmWindow)" stroke="#3f3560" strokeWidth="2.5" />
            <circle cx="233" cy="258" r="13" fill="url(#lampGlow)" />
            <circle cx="266" cy="270" r="2.8" fill="#9d92b8" />
            <rect x="211" y="278" width="44" height="15" rx="3.5" fill="#e8d9ba" transform="rotate(-3 233 285)" />
            <text className="tag-text" x="233" y="289" textAnchor="middle" transform="rotate(-3 233 285)">店长室</text>
            <title>设置</title>
          </g>

          {/* 人行道 */}
          <rect x="0" y="302" width="300" height="34" fill="#191428" />
          <line x1="0" y1="302" x2="300" y2="302" stroke="#241f3a" strokeWidth="1.5" />
          <ellipse cx="91" cy="308" rx="86" ry="9" fill="#ffc98b" opacity="0.06" />

          {/* 盆栽 */}
          <g opacity="0.9">
            <circle cx="17" cy="278" r="9" fill="#41584b" />
            <circle cx="10" cy="285" r="7" fill="#374c40" />
            <circle cx="25" cy="286" r="7" fill="#48604f" />
            <path d="M 8 291 L 27 291 L 24 308 L 11 308 Z" fill="#75593f" />
          </g>

          {/* 小猫 */}
          <g className="cat">
            <path
              className="cat-tail"
              d="M 178 322 q 15 2 17 -13"
              fill="none"
              stroke="#131022"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <ellipse cx="165" cy="317" rx="16" ry="13" fill="#131022" />
            <circle cx="157" cy="299" r="10.5" fill="#131022" />
            <path d="M 149 293 L 150 283 L 156 290 Z" fill="#131022" />
            <path d="M 165 293 L 164 283 L 158 290 Z" fill="#131022" />
            <circle className="cat-eye" cx="153" cy="298" r="1.6" />
            <circle className="cat-eye" cx="161" cy="298" r="1.6" />
          </g>
        </svg>
      </div>

      <div className="home-captions">
        <p className="home-hint">点点店里的东西试试</p>
        <p className="home-footnote">深夜的店，不打烊，也不催你走</p>
      </div>
    </div>
  );
}
