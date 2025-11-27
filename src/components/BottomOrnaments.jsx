import BgLeftBottom from '@/images/bg-left-bottom.png';
import BgRightBottom from '@/images/bg-right-bottom.png';
import BgBottom from '@/images/bg-bottom.png';

const BottomOrnaments = () => (
  <>
    <div className="pointer-events-none absolute bottom-0 left-0">
      <img
        src={BgLeftBottom}
        alt=""
        className="h-120 sm:h-[50rem] md:h-[60rem] object-contain"
        loading="lazy"
      />
    </div>

    <div className="pointer-events-none absolute bottom-0 right-0">
      <img
        src={BgRightBottom}
        alt=""
        className="h-120 sm:h-[50rem] md:h-[60rem] object-contain"
        loading="lazy"
      />
    </div>

    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
      <img
        src={BgBottom}
        alt=""
        className="w-full max-w-[520px] sm:max-w-[640px] object-contain"
        loading="lazy"
      />
    </div>
  </>
);

export default BottomOrnaments;
