import { ChangeEvent, useEffect, useState } from 'react';
import uuid from 'react-uuid';
import MaterialItem from '../MaterialItem';
import {
  IOption,
  IProductExtended,
  ISelectedOption
} from '../../../interfaces/productInterfaces';
import {
  updateSelectedItems,
  selectedItems,
  selectProductSelectedId,
  updateSelectedFilterItems
} from '../../../store/reducers/selectedItemsSlice';
import {
  useAppDispatch,
  useAppSelector
} from '../../../hooks/reduxOverwriteHooks';
import { THUMBNAILS_API } from '../../../configs/api.config';

interface IOptions {
  options: IOption;
  selectedOptions: ISelectedOption;
}

const Materials = ({ options, selectedOptions }: IOptions) => {
  const dispatch = useAppDispatch();
  const items: Array<IProductExtended> = useAppSelector(selectedItems);
  const productSelectedId: string = useAppSelector(selectProductSelectedId);

  const [selectedOption, setSelectedOption] = useState({
    option: selectedOptions.option,
    optionId: selectedOptions.optionId,
    value: selectedOptions.value,
    valueId: selectedOptions.valueId,
    valueSku: selectedOptions.valueSku
  });

  const [query, setQuery] = useState<string>('');
  const [materials, setMaterials] = useState<any>([]);
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    if (options) {
      options.dropDown.map(option =>
        setMaterials(current => [...current, option])
      );
    }
  }, []);

  useEffect(() => {
    if (materials) {
      setFilter(
        materials.filter(item =>
          item.title.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [materials, query]);

  const getConfigThumbnail = (VRayAssetId: string, VRayConfig: object) => {
    const { HOST, ENVIRONMENT, AUTH_TOKEN, STAGE_ID, WIDTH, HEIGHT, FORMAT } =
      THUMBNAILS_API;
    const CONFIG = encodeURIComponent(JSON.stringify(VRayConfig));
    const CACHE_KEY = '2023-04-10';

    const URL = `${HOST}api/fast-composite?environment=${ENVIRONMENT}&authToken=${AUTH_TOKEN}&assetId=${VRayAssetId}&stageId=${STAGE_ID}&configuration=${CONFIG}&width=${WIDTH}&height=${HEIGHT}&format=${FORMAT}&cacheKey=${CACHE_KEY}`;

    return URL;
  };

  const updateSelectedOption = (id: string, name: string, sku: string) => {
    const itemsCopy: Array<IProductExtended> = JSON.parse(
      JSON.stringify(items)
    );

    itemsCopy.find(item => {
      if (item.id === productSelectedId) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const VRayConfiguration: object = {
          [THUMBNAILS_API.THUMBNAIL_CAMERA!]:
            THUMBNAILS_API.THUMBNAIL_CAMERA_VALUE
        };

        item.selectedOptions?.find(option => {
          if (option.optionId === selectedOption.optionId) {
            if (name.toLowerCase().includes('strap')) {
              const newName = name.slice(0, name.indexOf(' '));
              option.value = newName;

              option.valueId = id;
              option.valueSku = sku;
            } else {
              option.value = name;
              option.valueId = id;
              option.valueSku = sku;
            }
          }
          return null;
        });

        const temp = window.threekitE.player.api.scene.get({
          evalNode: true,
          id: item.nodeId
        });
        const generalAttributes: Array<any> =
          temp.Null.link.configurator.getAttributes();

        generalAttributes.forEach(attribute => {
          item.selectedOptions?.forEach(option => {
            if (
              attribute.name === option.option &&
              attribute.type === 'Asset'
            ) {
              attribute.values.some(value => {
                let optionFound = false;
                let selection: string = option.value;
                const selectionSku: string = option.valueSku.slice(
                  option.valueSku.lastIndexOf('_') + 1,
                  option.valueSku.length
                );
                const isNumber = !Number.isNaN(value.name.slice(-1) % 1);

                if (option.value.includes('|')) {
                  selection = option.value
                    .slice(0, option.value.lastIndexOf('|'))
                    .trim();
                }
                selection = `${selection} | ${selectionSku}`;

                if (
                  value.name.toUpperCase() === selection.toUpperCase() &&
                  isNumber
                ) {
                  VRayConfiguration[`${attribute.name}`] = {
                    assetId: value.assetId
                  };
                  optionFound = true;
                }
                return optionFound;
              });
            }
          });
        });
        item.config_thumbnail = getConfigThumbnail(
          item.threekit_asset_id,
          VRayConfiguration
        );
        dispatch(updateSelectedFilterItems(item));
      }
      return null;
    });

    dispatch(updateSelectedItems(itemsCopy));
    setSelectedOption({
      ...selectedOption,
      value: name,
      valueId: id,
      valueSku: sku
    });
  };
  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);

  return (
    <div className="w-full px-10 py-2 ">
      <div className="relative flex items-center w-full h-16 mt-6">
        <svg
          className="absolute left-0"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="m17 17l4 4M3 11a8 8 0 1 0 16 0a8 8 0 0 0-16 0Z"
          />
        </svg>
        <input
          type="search"
          className="w-full h-full bg-transparent border-b outline-none p-[10px_100px_10px_40px]"
          onChange={handleQueryChange}
        />

        <button
          type="button"
          className="absolute right-0 uppercase bg-transparent border-none outline-none"
        >
          filter & sort
        </button>
      </div>

      <div
        className="w-full overflow-y-auto mt-10 grid grid-cols-3 gap-y-10 gap-x-4 h-[470px] pb-4"
        id="container-products"
      >
        {materials &&
          filter.map(option => (
            <MaterialItem
              key={uuid()}
              option={option}
              selectedOption={selectedOption}
              updateSelectedOption={updateSelectedOption}
            />
          ))}
      </div>
    </div>
  );
};

export default Materials;
