import Image from 'next/image';
import { IDropDown } from '../../../interfaces/productInterfaces';

interface IMaterialItem {
  option: IDropDown;
  selectedOption: any;
  updateSelectedOption: (id: string, name: string, sku: string) => void;
}

const MaterialItem = ({
  option,
  selectedOption,
  updateSelectedOption
}: IMaterialItem) => {
  const handleOnChange = (e: any) => {
    if (!e.target.title && !e.target.title) {
      updateSelectedOption(e.target.id, e.target.name, e.target.alt);
    } else {
      updateSelectedOption(e.target.id, e.target.title, e.target.alt);
    }
  };

  return (
    <div className="relative col-span-1">
      <div className="absolute top-4 right-4">
        <div className="flex items-center">
          <input
            id={option.uid}
            type="checkbox"
            alt={option.sku}
            name={option.title}
            className="absolute w-6 h-6 opacity-0"
            defaultChecked={option.uid === selectedOption.valueId}
            onChange={handleOnChange}
          />
          <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 mr-2 bg-white border-2 border-black focus-within:border-black">
            <svg
              className="hidden w-3 h-3 text-black pointer-events-none fill-current"
              version="1.1"
              viewBox="0 0 17 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none" fillRule="evenodd">
                <g
                  transform="translate(-9 -11)"
                  fill="#000000"
                  fillRule="nonzero"
                >
                  <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
      <Image
        id={option.uid}
        title={option.title}
        width={209}
        height={209}
        quality={100}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        src={option.image!}
        alt={option.sku}
        onClick={handleOnChange}
      />
      <h3 className="mt-4 text-xs text-black uppercase">{option.title}</h3>
    </div>
  );
};

export default MaterialItem;
