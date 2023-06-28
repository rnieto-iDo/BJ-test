import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { useThreekitInitStatus, AwaitThreekitLoad, Player } from '@threekit-tools/treble';
import { PRIVATE_APIS } from '@threekit-tools/treble/dist/types';
import axios from 'axios';
import Canvas from '../../canvas/Canvas';
import ModalShare from '../ModalShare';
import { setTakeScreenShot, setThreekitEnv } from '../../../store/reducers/canvasSlice';
import { getCurrentUserApi } from '../../../api/routes/users';
import { RootState } from '../../../types/redux.types';
import { addCustomSvgFloor, updateThreekitProps } from '../../../helpers/threekitHelper';
import { createSvgOnThreekit } from '../../../helpers/canvasHelper';
import Loader from '../Loader/index';
import { setIsLoaded, setSavedProject, setRebuilt } from '../../../store/reducers/savedProjectSlice';
import { IProductExtended } from '../../../interfaces/productInterfaces';

const ProductViewer = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedItems = useSelector((state: RootState) => state.selectedItems);
  const isThreekitEnv = useSelector((state: RootState) => state.canvas.threekitEnv);
  const savedProjectState = useSelector((state: RootState) => state.savedProject);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenThreekit, setIsOpenThreekit] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const threekitLoaded = useThreekitInitStatus();
  const playerContainer = useRef<HTMLDivElement>(null)

  const getProjectId = (): string | null => {
    const match = router.asPath.match(/\/project\/(\w+)/);
    return match ? match[1] : null;
  };

  const handleOnclickThreekit = (): void => {
    setIsOpenThreekit(!isOpenThreekit);
    dispatch(setThreekitEnv(!isThreekitEnv));
  };

  const saveDataApi = async body => {
    // const HOST = 'http://localhost:5001/addNewConfigurationInDataTable';
    const HOST = 'https://brown-jordan.herokuapp.com/addNewConfigurationInDataTable';

    axios
      .post(HOST, body, { responseType: 'blob' })
      .then((data) => console.log(data)
      )
      .catch(e => e);
  };

  const getSavedProject = async () => {
    const id = user ? (user as { email: string }).email : 'test@test.com';
    const project_id = getProjectId()

    const HOST = `https://brown-jordan.herokuapp.com/getDataTableById/${id}`;
    // const HOST = `http://localhost:5001/getDataTableById/${id}`

    // if (!project_id) {
    //   const params = {
    //     id,
    //     project_id: 'hardcoded16'
    //   }
    //   axios
    //     .get(HOST, { params })
    //     .then(response => {
    //       if (response) {
    //         dispatch(setSavedProject({ ...response.data, isLoaded: true }));
    //       }
    //     })
    //     .catch(error => {
    //       if (error) {
    //         console.log(error);
    //       }
    //     });

    // }
    // else {
      const params = {
        id,
        project_id,
      }

      axios
        .get(HOST, { params })
        .then(response => {
          if (response.data[0]?.value?.Configuration) {
           dispatch(setSavedProject({ ...response.data[0], isLoaded: true }));
          }
          else{

              dispatch(setIsLoaded(true))
              dispatch(setRebuilt(true))
          //   const projectIdURL = getProjectId();
          //   const body = {
          //     user_id: user ? (user as { email: string }).email : 'test@test.com',
          //     project_id: projectIdURL,
          //     Date: Date.now(),
          //     Configuration: JSON.stringify(selectedItems.products),
          //     roomSize: JSON.stringify(selectedItems.roomSize),
          //   }
          //   saveDataApi(body)
          }
        })
        .catch(error => {
          if (error) {
            console.log(error);
          }
        });
   // }

  };

  const addModelsFrom2Dto3D = () => {
    const idsUpdate: Array<IProductExtended> = JSON.parse(JSON.stringify([...selectedItems.products]));
    const attributerGeneral: Array<any> = window.threekit.configurator.getAttributes();
    // eslint-disable-next-line no-unused-expressions
    idsUpdate.length > 0 && idsUpdate.forEach((element) => {
      const elementCurrent: IProductExtended = JSON.parse(JSON.stringify(element));
      const assetId = elementCurrent.nodeId;

      if (element.selectedOptions) {
        const temp = window.threekitE.player.api.scene.get({ evalNode: true, id: assetId });
        element.selectedOptions.forEach(option => {
          let isModel = false;
          // look in the global attributes for the type of attributes
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < attributerGeneral.length; i++) {
            if (attributerGeneral[i].name === option.option && attributerGeneral[i].type === 'Asset') {
              // define if the attribute is a asset or a string
              isModel = true;
              const valueIDAttribute: Array<any> = [];
              attributerGeneral[i].values.some((value: any) => {
                let optionFound = false;
                let selection: string = option.value;
                const selectionSku: string = option.valueSku.slice(option.valueSku.lastIndexOf("_") + 1, option.valueSku.length);
                const isNumber = !Number.isNaN(value.name.slice(-1) % 1);

                if (option.value.includes("|")) {
                  selection = option.value.slice(0, option.value.lastIndexOf("|")).trim();
                }

                selection = `${selection} | ${selectionSku} LR`;

                if (value.name.toUpperCase() === selection.toUpperCase() && !isNumber) {
                  valueIDAttribute.push(value);
                  optionFound = true;
                }

                return optionFound;
              });
              // eslint-disable-next-line no-unused-expressions
              valueIDAttribute.length > 0 && temp?.Null?.link?.configurator.setConfiguration({ [option.option]: { assetId: valueIDAttribute[0].assetId }, type: "item" });
            }
          }
          if (!isModel) {
            // if( temp === null || temp.Null === null || temp.Null.link === undefined) return;
            temp?.Null?.link?.configurator.setConfiguration({
              [option.option]: option.value
            });
          }
        });
      }
    })
    window.threekit.configurator.setConfiguration({ '': '' });
  }

  const renderFloor = async () => {
    if (window.threekit) {
      window.threekit.player.enableApi(PRIVATE_APIS.PLAYER);
      updateThreekitProps();
      await createSvgOnThreekit().then((data: any) => {
        // eslint-disable-next-line dot-notation
        const hashFile = data['response'][0]['hash'];
        const fileName = data.response[0].filename;

        addCustomSvgFloor(hashFile, fileName);
        addModelsFrom2Dto3D();
      })
    }
  };

  const actiTakeScreenShot = () => {
    dispatch(setTakeScreenShot(true));
  };

  const handleOnClickModal = () => {
    actiTakeScreenShot();
    setIsOpenModal(!isOpenModal);
  };

  const getUserApi = async () => {
    const { data, error } = await getCurrentUserApi();
    if (error) {
      return error;
    }
    return data;
  };

  const getCurrentUser = async () => {
    const res = await getUserApi();
    setUser(res.customer);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (isOpenThreekit) {
      renderFloor();
    }
  }, [isOpenThreekit]);

  useEffect(() => {
    if (threekitLoaded) {
      renderFloor();
      setTimeout(() => {
        renderFloor();
      }, 1000);
      setIsOpenThreekit(!threekitLoaded);
      setIsLoading(!threekitLoaded);
      dispatch(setThreekitEnv(!isThreekitEnv));
    }
  }, [threekitLoaded]);

  useEffect(() => {
    if (playerContainer) {
      getSavedProject()
    }

  }, [playerContainer])

  const autoSave = async () => {
    const projectIdURL = getProjectId();
    if (!projectIdURL) {
      const hardcodedId = 'hardcoded16'
      const body = {
        user_id: user ? (user as { email: string }).email : 'test@test.com',
        project_id: hardcodedId,
        Date: Date.now(),
        Configuration: JSON.stringify(selectedItems.products),
        roomSize: JSON.stringify(selectedItems.roomSize),
      };
      await saveDataApi(body);
    } else {
      const body = {
        user_id: user ? (user as { email: string }).email : 'test@test.com',
        project_id: projectIdURL,
        Date: Date.now(),
        Configuration: JSON.stringify(selectedItems.products),
        roomSize: JSON.stringify(selectedItems.roomSize),
      }
      await saveDataApi(body);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line no-undef
    let debounce: NodeJS.Timeout;

    if (savedProjectState.isLoaded) {
      debounce = setTimeout(() => {
        // eslint-disable-next-line no-unused-expressions
        autoSave();
      }, 2000);
    }
    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems.products, selectedItems.roomSize]);

  return (
    <>
      <div className="relative min-h-[500px] flex items-center border-solid">
        {isLoading && <Loader borderWidth="border-10" color="border-black" width="w-[100px]" height="h-[100px]" />}
        <AwaitThreekitLoad>
          <div className={`w-full ${!isOpenThreekit ? 'opacity-0 pointer-events-none z-0' : 'opacity-100 pointer-events-auto z-10'} absolute top-0 left-0`} ref={playerContainer}>
            <Player />
          </div>
          <div className={`ath-space-builder ${isOpenThreekit ? 'opacity-0 pointer-events-none z-0' : 'opacity-100 pointer-events-auto z-10'}`}>
            <Canvas />
          </div>
        </AwaitThreekitLoad>
      </div>
      <div className="flex items-center justify-between w-full mt-12">
      
          <AwaitThreekitLoad>
          <div className="">
            <button type="button" className={`px-6 py-4 ${!isOpenThreekit ? 'bg-black text-white' : 'bg-white text-black'} border`} onClick={handleOnclickThreekit}>
              2D
            </button>
            <button type="button" className={`px-6 py-4 ${isOpenThreekit ? 'bg-black text-white' : 'bg-white text-black'} border`} onClick={handleOnclickThreekit}>
              3D
            </button>
        </div>

            <button onClick={handleOnClickModal} type="button" className="px-10 py-4 mr-6 text-white bg-black border-none">
              Share the Board
            </button>

          </AwaitThreekitLoad>
          
        

        {isOpenModal && <ModalShare handleOnClickModal={handleOnClickModal} />}
      </div>
    </>
  );
};

export default ProductViewer;