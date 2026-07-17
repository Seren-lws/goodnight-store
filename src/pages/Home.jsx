import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const nav = useNavigate();

  return (
    <div className="home-page">
      <svg
        className="store-scene"
        viewBox="0 0 380 620"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="晚安便利店店面"
      >
        <defs>
          <linearGradient id="warmWindow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6e5340" />
            <stop offset="100%" stopColor="#43325a" />
          </linearGradient>
          <radialGradient id="lampGlow" cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#ffd9a0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffd9a0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="moonFace" cx="35%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#fff7e6" />
            <stop offset="70%" stopColor="#ffc98b" />
          </radialGradient>
          <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 星空 */}
        <g>
          <circle className="star" cx="40" cy="42" r="1.6" />
          <circle className="star star-d1" cx="92" cy="72" r="1.2" />
          <circle className="star star-d2" cx="152" cy="32" r="1.5" />
          <circle className="star star-d3" cx="222" cy="62" r="1.2" />
          <circle className="star star-d1" cx="332" cy="104" r="1.4" />
          <circle className="star star-d2" cx="62" cy="112" r="1.1" />
          <circle className="star star-d3" cx="252" cy="26" r="1.3" />
        </g>

        {/* 月亮 */}
        <path
          className="moon"
          d="M 312 28 A 27 27 0 1 0 312 84 A 21 21 0 1 1 312 28 Z"
          fill="url(#moonFace)"
          filter="url(#softGlow)"
        />

        {/* 招牌 */}
        <g className="sign">
          <rect x="92" y="94" width="196" height="50" rx="14" fill="#241f3a" stroke="rgba(255,201,139,0.45)" strokeWidth="1.5" />
          <circle className="bulb" cx="104" cy="106" r="2.6" />
          <circle className="bulb bulb-d" cx="276" cy="106" r="2.6" />
          <text className="sign-text" x="190" y="127" textAnchor="middle" filter="url(#softGlow)">
            晚安便利店
          </text>
        </g>

        {/* 店体 */}
        <rect x="24" y="150" width="332" height="340" rx="14" fill="#2b2545" />

        {/* 雨棚 */}
        <rect x="24" y="150" width="332" height="30" rx="14" fill="#332a54" />
        <g>
          {Array.from({ length: 8 }).map((_, i) => (
            <path
              key={i}
              d={`M ${28 + i * 41} 178 a 20.5 14 0 0 0 41 0 Z`}
              fill={i % 2 === 0 ? '#b3a1e6' : '#ffc98b'}
              opacity="0.75"
            />
          ))}
        </g>

        {/* 橱窗 */}
        <rect x="40" y="210" width="188" height="182" rx="10" fill="#1a1530" stroke="#3a3258" strokeWidth="3" />
        <rect className="window-light" x="46" y="216" width="176" height="164" rx="7" fill="url(#warmWindow)" />
        <rect x="46" y="216" width="176" height="164" rx="7" fill="url(#lampGlow)" />
        {/* 窗棂 */}
        <rect x="131" y="216" width="6" height="164" fill="#3a3258" />
        {/* 窗台 */}
        <rect x="38" y="392" width="192" height="8" rx="4" fill="#4a3c66" />

        {/* 橱窗左：书架（故事柜） */}
        <g className="hotspot" onClick={() => nav('/story')} role="button" aria-label="故事柜">
          <rect x="52" y="268" width="72" height="5" rx="2" fill="#4a3c66" />
          <rect x="52" y="320" width="72" height="5" rx="2" fill="#4a3c66" />
          {/* 上层书 */}
          <rect x="55" y="240" width="10" height="28" rx="2" fill="#cf8da6" />
          <rect x="67" y="244" width="9" height="24" rx="2" fill="#8de0c9" />
          <rect x="78" y="241" width="10" height="27" rx="2" fill="#b3a1e6" />
          <rect x="90" y="245" width="9" height="23" rx="2" fill="#ffc98b" />
          <rect x="102" y="242" width="10" height="26" rx="2" fill="#8aa8d9" transform="rotate(8 107 268)" />
          {/* 下层书 */}
          <rect x="55" y="294" width="9" height="26" rx="2" fill="#ffc98b" />
          <rect x="66" y="297" width="10" height="23" rx="2" fill="#8aa8d9" />
          <rect x="78" y="293" width="9" height="27" rx="2" fill="#cf8da6" />
          <rect x="89" y="296" width="10" height="24" rx="2" fill="#8de0c9" />
          <rect x="101" y="294" width="9" height="26" rx="2" fill="#b3a1e6" transform="rotate(-7 105 320)" />
          {/* 吊牌 */}
          <line x1="88" y1="400" x2="88" y2="410" stroke="#8a7a5c" strokeWidth="1.5" />
          <rect x="68" y="410" width="40" height="20" rx="5" fill="#f5e6c8" />
          <text className="tag-text" x="88" y="424" textAnchor="middle">故事</text>
          <rect x="40" y="210" width="94" height="226" fill="transparent" />
          <title>故事柜</title>
        </g>

        {/* 橱窗右：收音机（声音角） */}
        <g className="hotspot" onClick={() => nav('/sounds')} role="button" aria-label="声音角">
          {/* 小桌 */}
          <rect x="146" y="334" width="68" height="7" rx="3" fill="#4a3c66" />
          <rect x="152" y="341" width="6" height="26" fill="#4a3c66" />
          <rect x="202" y="341" width="6" height="26" fill="#4a3c66" />
          {/* 天线 */}
          <line x1="200" y1="292" x2="214" y2="266" stroke="#b3a8cc" strokeWidth="2" strokeLinecap="round" />
          <circle cx="214" cy="265" r="2.2" fill="#b3a8cc" />
          {/* 机身 */}
          <rect x="152" y="292" width="58" height="42" rx="9" fill="#cf8da6" />
          <circle cx="170" cy="313" r="11" fill="#241f3a" />
          <line x1="164" y1="309" x2="176" y2="309" stroke="#5a4a72" strokeWidth="1.5" />
          <line x1="163" y1="313" x2="177" y2="313" stroke="#5a4a72" strokeWidth="1.5" />
          <line x1="164" y1="317" x2="176" y2="317" stroke="#5a4a72" strokeWidth="1.5" />
          <rect x="188" y="300" width="14" height="8" rx="3" fill="#ffd9a0" />
          <circle cx="195" cy="320" r="3.5" fill="#241f3a" />
          {/* 音符 */}
          <text className="note-float" x="222" y="288">♪</text>
          <text className="note-float note-float-d" x="234" y="304">♩</text>
          {/* 吊牌 */}
          <line x1="180" y1="400" x2="180" y2="410" stroke="#8a7a5c" strokeWidth="1.5" />
          <rect x="160" y="410" width="40" height="20" rx="5" fill="#f5e6c8" />
          <text className="tag-text" x="180" y="424" textAnchor="middle">声音</text>
          <rect x="134" y="210" width="94" height="226" fill="transparent" />
          <title>声音角</title>
        </g>

        {/* 便签板（便签墙） */}
        <g className="hotspot" onClick={() => nav('/notes')} role="button" aria-label="便签墙">
          <rect x="244" y="210" width="98" height="100" rx="9" fill="#3a2f52" stroke="#4a3c66" strokeWidth="3" />
          <rect x="256" y="224" width="26" height="26" rx="3" fill="#ffd9a0" transform="rotate(-5 269 237)" />
          <rect x="290" y="228" width="26" height="26" rx="3" fill="#ffb3c1" transform="rotate(6 303 241)" />
          <rect x="262" y="262" width="26" height="26" rx="3" fill="#a8e6cf" transform="rotate(4 275 275)" />
          <rect x="296" y="266" width="24" height="24" rx="3" fill="#c9b8f0" transform="rotate(-6 308 278)" />
          <circle cx="269" cy="228" r="2" fill="#8a7a5c" />
          <circle cx="303" cy="232" r="2" fill="#8a7a5c" />
          <circle cx="275" cy="266" r="2" fill="#8a7a5c" />
          {/* 吊牌 */}
          <line x1="293" y1="310" x2="293" y2="318" stroke="#8a7a5c" strokeWidth="1.5" />
          <rect x="273" y="318" width="40" height="20" rx="5" fill="#f5e6c8" />
          <text className="tag-text" x="293" y="332" textAnchor="middle">便签</text>
          <title>便签墙</title>
        </g>

        {/* 店长室的门（设置） */}
        <g className="hotspot" onClick={() => nav('/settings')} role="button" aria-label="设置">
          <rect x="244" y="346" width="98" height="144" rx="9" fill="#332a54" stroke="#4a3c66" strokeWidth="3" />
          <circle cx="293" cy="390" r="17" fill="url(#warmWindow)" stroke="#4a3c66" strokeWidth="3" />
          <circle cx="293" cy="390" r="17" fill="url(#lampGlow)" />
          <circle cx="316" cy="432" r="3.5" fill="#b3a8cc" />
          <rect x="266" y="446" width="54" height="18" rx="4" fill="#f5e6c8" transform="rotate(-3 293 455)" />
          <text className="tag-text" x="293" y="459" textAnchor="middle" transform="rotate(-3 293 455)">店长室</text>
          <title>设置</title>
        </g>

        {/* 人行道 */}
        <rect x="0" y="490" width="380" height="34" fill="#191428" />
        <line x1="0" y1="490" x2="380" y2="490" stroke="#241f3a" strokeWidth="2" />
        {/* 灯光洒地 */}
        <ellipse cx="134" cy="498" rx="110" ry="12" fill="#ffc98b" opacity="0.07" />
        <ellipse cx="293" cy="498" rx="60" ry="9" fill="#ffc98b" opacity="0.06" />

        {/* 盆栽 */}
        <g>
          <circle cx="48" cy="452" r="12" fill="#4a6b58" />
          <circle cx="38" cy="460" r="9" fill="#3d5a4a" />
          <circle cx="57" cy="461" r="9" fill="#54785f" />
          <path d="M 36 468 L 60 468 L 56 490 L 40 490 Z" fill="#8a6a4f" />
        </g>

        {/* 小猫 */}
        <g className="cat">
          <path
            className="cat-tail"
            d="M 208 512 q 18 2 20 -16"
            fill="none"
            stroke="#171226"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <ellipse cx="192" cy="506" rx="20" ry="16" fill="#171226" />
          <circle cx="182" cy="484" r="13" fill="#171226" />
          <path d="M 172 476 L 174 464 L 181 472 Z" fill="#171226" />
          <path d="M 192 476 L 190 464 L 183 472 Z" fill="#171226" />
          <circle className="cat-eye" cx="177" cy="483" r="2" />
          <circle className="cat-eye" cx="187" cy="483" r="2" />
        </g>
      </svg>

      <p className="home-hint">点点店里的东西试试</p>
      <p className="home-footnote">深夜的店，不打烊，也不催你走</p>
    </div>
  );
}
