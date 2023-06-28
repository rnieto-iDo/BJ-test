import React, { useState } from 'react';
import ProjectItems from './ProjectItems/ProjectItems';
import ProjectReview from './ProjectReview/ProjectReview';
import AdditionalItems from './AdditionalItems/AdditionalItems';

interface Tab {
    id: string;
    title: string;
    content: React.ReactNode;
}

const tabs: Tab[] = [
    {
        id: '1',
        title: 'Project Items',
        content: <ProjectItems />,
    },
    {
        id: '2',
        title: 'Additional Items',
        content: <AdditionalItems />,
    },
    {
        id: '3',
        title: 'Project Review',
        content: <ProjectReview />,
    },
];

const MoodboardMenu = () => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
    };

    return (
        <form className="w-full h-[calc(100%_-_76px)]" action="">
            {/* Menu Tabs  */}
            <div className="flex justify-between w-full mb-6 border-b border-black rounded-t">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        className={`${activeTab === tab.id ? 'border-black' : 'inline-block text-[#7C7C7A] border-transparent'} py-2 px-10 font-semibold border-b-2 outline-none`}
                        onClick={() => handleTabClick(tab.id)}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>

            {/* Tabs Content  */}

            <div className="w-full h-[80%]">
                {tabs.map(tab => (
                    <div key={tab.id} className={`${activeTab === tab.id ? 'block' : 'hidden'} h-full `}>
                        {tab.content}
                    </div>
                ))}
            </div>

            {/* Button next  */}

            {/* <button onClick={handleOnClick} className="absolute bottom-0 z-10 w-full py-4 text-white bg-black" type="button">
      {parseInt(activeTab, 10) !== tabs.length ? 'Next' : `Add ${ selectedItems.products.length }  Items to Cart`}
    </button> */}
        </form>
    );
};

export default MoodboardMenu;
