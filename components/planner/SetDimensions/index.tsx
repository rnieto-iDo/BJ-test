import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../types/redux.types';
import { useAppDispatch } from '../../../hooks/reduxOverwriteHooks';

import {
  setDimensions,
  SetDimensionsParams
} from '../../../store/reducers/setDimensionsSlice';

const SetDimensions = () => {
  const dispatch = useAppDispatch();
  const dimensionsState = useSelector(
    (state: RootState) => state.setDimensions
  );
  const [localDimensions, setlocalDimensions] =
    useState<SetDimensionsParams>(dimensionsState);

  useEffect(() => {
    // console.log('deberia actualizar...')
    // console.log(dimensionsState)
    const w = Number.isNaN(dimensionsState.width) ? 15 : dimensionsState.width;
    const l = Number.isNaN(dimensionsState.length)
      ? 15
      : dimensionsState.length;

    setlocalDimensions({
      width: w,
      length: l,
      unitMeasure: 'feet'
    });
  }, [dimensionsState]);

  const handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const updatedDimensions = { ...localDimensions, [name]: value };
    if (updatedDimensions.length > 0 && updatedDimensions.width > 0) {
      setlocalDimensions(updatedDimensions);
      if (updatedDimensions.length > 9 && updatedDimensions.width > 9) {
        dispatch(setDimensions(updatedDimensions));
      }
    }
  };

  return (
    <div className="w-full flex gap-3 justify-center items-center h-full">
      <div className="relative">
        <span className="absolute left-1 top-1 flex items-center pl-3 text-xs text-[#7C7C7A]">
          Width
        </span>
        <input
          onChange={handleOnChange}
          name="width"
          id="width"
          type="number"
          className="w-24 h-14 bg-transparent border-2 border-black outline-none p-4 pt-5"
          value={localDimensions.width}
        />
      </div>
      <div className="relative">
        <span className="absolute left-1 top-1 flex items-center pl-3 text-xs text-[#7C7C7A]">
          Length
        </span>
        <input
          onChange={handleOnChange}
          name="length"
          id="length"
          type="number"
          className="w-24 h-14 bg-transparent border-2 border-black outline-none p-4 pt-5"
          value={localDimensions.length}
        />
      </div>
      <select
        value={localDimensions.unitMeasure || 'feet'}
        onChange={handleOnChange}
        name="unitMeasure"
        className="bg-transparent border-2 border-black outline-none p-4 w-[210px]"
        id="unitMeasure"
      >
        <option value="inch">inch</option>
        <option value="feet">feet</option>
      </select>
    </div>
  );
};

export default SetDimensions;
