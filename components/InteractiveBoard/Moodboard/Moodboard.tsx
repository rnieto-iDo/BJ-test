import React, { useState } from 'react';
import MoodboardMenu from './MoodboardMenu/MoodboardMenu';
import MoodboardViewer from './MoodboardViewer/MoodboardViewer';

const Moodboard = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(true);

  const handleToggle = () => {
    setIsOpenMenu(!isOpenMenu);
  };
  return (
    <section className="grid w-full grid-cols-[1fr,_40%]  overflow-hidden font-haasUnica">
      <div
        className={`transition-all duration-500 ease-in-out w-full relative   ${
          isOpenMenu ? 'col-span-1' : 'col-span-2'
        } row-start-1 row-end-1 bg-[#FBFBF9] flex flex-col items-center justify-center`}
      >
        {/* if is open menu then hidden button and is close menu show button  */}
        {!isOpenMenu && (
          <button
            onClick={handleToggle}
            className="absolute px-20 py-4 border-2 border-black top-10 right-10"
            type="button"
          >
            Menu
          </button>
        )}
        {/* / / /  */}

        <MoodboardViewer />
      </div>
      <div
        className={`transition-all duration-500 ease-in-out w-full relative border-l-2 overflow-hidden ${
          isOpenMenu ? 'col-span-1' : 'hidden'
        } row-start-1 row-end-1`}
      >
        <div className="flex items-center justify-end w-full p-5 py-3 pr-10">
          <button onClick={handleToggle} className="text-3xl" type="button">
            &times;
          </button>
        </div>

        <MoodboardMenu />
      </div>
    </section>
  );
};

export default Moodboard;
