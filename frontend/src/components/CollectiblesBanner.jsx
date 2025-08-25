export default function CollectiblesBanner() {
  return (
    <div className="banner-wrap">
      <style>{`
        .banner-wrap { width: 100%; }
        .collectibles-banner {
          position: relative;
          width: 100%;
          height: 240px;
          border-radius: 20px;
          overflow: hidden;
          background: radial-gradient(120% 120% at 10% 0%, #ffe56b 0%, #ffd43b 35%, #ffc300 60%, #f7b500 100%);
          box-shadow: 0 14px 40px rgba(0,0,0,0.18);
          isolation: isolate;
        }

        /* subtle grid pattern */
        .collectibles-banner::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px);
          background-size: 24px 24px;
          mix-blend-mode: soft-light;
          opacity: .35;
          pointer-events: none;
        }

        /* decorative blobs */
        .blob { position: absolute; filter: blur(4px); opacity: .28; }
        .blob-1 { top: -30px; left: -30px; width: 180px; height: 180px; background: #fff7b0; border-radius: 40% 60% 50% 50% / 50% 40% 60% 50%; }
        .blob-2 { bottom: -40px; right: -20px; width: 220px; height: 220px; background: #ffef7a; border-radius: 55% 45% 60% 40% / 40% 60% 45% 55%; }

        /* sparkles */
        .sparkle { position: absolute; width: 10px; height: 10px; background: white; border-radius: 2px; transform: rotate(45deg); opacity: .85; animation: twinkle 2.2s ease-in-out infinite; }
        .s1 { top: 30px; left: 22%; animation-delay: .1s; }
        .s2 { top: 80px; right: 18%; width: 8px; height: 8px; animation-delay: .5s; }
        .s3 { bottom: 36px; left: 15%; width: 7px; height: 7px; animation-delay: .9s; }
        @keyframes twinkle { 0%, 100% { transform: rotate(45deg) scale(0.85); opacity: .6; } 50% { transform: rotate(45deg) scale(1.1); opacity: 1; } }

        .content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 24px;
        }

        .tag {
          display: inline-block;
          padding: 6px 12px;
          font-size: 12px;
          letter-spacing: .12em;
          text-transform: uppercase;
          background: rgba(255,255,255,.3);
          border: 1px solid rgba(255,255,255,.6);
          color: #3a2e00;
          border-radius: 999px;
          backdrop-filter: blur(6px);
          margin-bottom: 10px;
        }

        .title {
          font-size: clamp(28px, 6vw, 54px);
          line-height: 1;
          margin: 6px 0 8px;
          font-weight: 800;
          letter-spacing: 0.02em;
          color: #2a1f00;
          text-shadow: 0 2px 0 rgba(255,255,255,.4), 0 8px 24px rgba(0,0,0,.22);
        }
        .title .fancy {
          display: inline-block;
          padding: 0 .18em;
          background: conic-gradient(from 90deg, #fffef2, #fff0a6, #fffef2);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: none;
          position: relative;
        }
        .title .fancy::after{
          content: "";
          position: absolute;
          left: 0; right: 0; bottom: -6px;
          height: 10px;
          border-radius: 999px;
          background: radial-gradient(60% 100% at 50% 100%, rgba(255,255,255,.8), rgba(255,255,255,0));
          opacity: .8;
        }

        .sub {
          color: #5a4300;
          font-size: clamp(12px, 2vw, 16px);
          opacity: .9;
        }

        /* framed art thumbnails */
        .thumbs {
          position: absolute; inset: 0; pointer-events: none; z-index: 1;
        }
        .frame {
          position: absolute; background: #fff; border-radius: 10px; padding: 6px; box-shadow: 0 8px 20px rgba(0,0,0,.2);
          transform: rotate(-3deg);
        }
        .frame img { display:block; width: 110px; height: 80px; object-fit: cover; border-radius: 6px; }
        .f1 { left: 24px; top: 28px; }
        .f2 { right: 28px; bottom: 24px; transform: rotate(4deg); }

        @media (max-width: 640px) {
          .collectibles-banner { height: 200px; }
          .frame img { width: 90px; height: 66px; }
        }
      `}</style>

      <section className="collectibles-banner">
        {/* soft blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />

        {/* sparkles */}
        <span className="sparkle s1" />
        <span className="sparkle s2" />
        <span className="sparkle s3" />

        {/* floating framed thumbnails (replace src with your art) */}
        <div className="thumbs">
          <div className="frame f1">
            <img src="https://picsum.photos/seed/ink1/220/160" alt="art-1" />
          </div>
          <div className="frame f2">
            <img src="https://picsum.photos/seed/ink2/220/160" alt="art-2" />
          </div>
        </div>

        <div className="content">
          <span className="tag">arts & collectibles</span>
          <h1 className="title">
            <span className="fancy">Collectibles</span>
          </h1>
          <p className="sub">
            Curated drops • Monochrome sketches • Inks & lines
          </p>
        </div>
      </section>
    </div>
  );
}
