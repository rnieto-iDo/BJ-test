import { ChangeEvent, useState } from "react";
import { useSelector } from "react-redux";
import { servicePdf, servicePdfEmail } from "../../../hooks/useServicePdf";
import { validateEmail } from "../../../utils/checkers";
import { RootState } from "../../../types/redux.types";
import { IProductExtended } from "../../../interfaces/productInterfaces";
import { IProduct } from "../../../interfaces/pdfInerfaces";
import { Check } from "../../../assets/icons";
import Loader from "../Loader/index"
import { filterByName } from "../../../helpers/threekitHelper";

type status = 'idle' | 'loading' | 'succeeded';

const ModalShare = (props: { handleOnClickModal: () => void }) => {
  const itemState = useSelector((state: RootState) => state.selectedItems);
  const canvasState = useSelector((state: RootState) => state.canvas);
  const [email, setEmail] = useState<string>("");
  const [shareStatus, setShareStatus] = useState<status>('idle');
  const [downloadStatus, setDownloadStatus] = useState<status>('idle');
  const [errorMessage, setErrorMessage] = useState({
    error: true,
    message: "It doesn't look like an email, please correct it."
  });

  const products: Array<IProduct> = itemState.products.map((item: IProductExtended) => ({
    name: item.name,
    price: item.price_range?.minimum_price?.final_price?.value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    image: item.config_thumbnail ? item.config_thumbnail : item.image.url,
    materials: item.selectedOptions?.map((option) => ({
      title: option.option,
      value: option.value
    }))

  }))

  const handleOnClickDownload = async () => {
    setDownloadStatus('loading');
    const res = await servicePdf({ url: 'createpdf2', productList: products });
    if (res === "succeeded") {
      setDownloadStatus('succeeded');
    }
    setTimeout(() => {
      setDownloadStatus('idle')
    }, 500);
  }

  const handleOnClickShare = async () => {

    if (email === "") {
      setErrorMessage({ ...errorMessage, error: false })
    } else {
      setShareStatus('loading');
      const res = await servicePdfEmail({ url: 'sendpdftoemail', productList: products, email })
      if (res === "succeeded") {
        setShareStatus('succeeded');
      }
      setTimeout(() => {
        setShareStatus('idle')
      }, 500);
    }
  }

  const handleOnChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (e.target.value !== "" && !validateEmail(email)) {
      setErrorMessage({ ...errorMessage, error: false });
    } else {
      setErrorMessage({ ...errorMessage, error: true });
    }
  }

  const takeSnapshot = async () => {
    const player = window.threekitE.player.api;
    const camera = filterByName({ name: 'Camera' }, 'name');
    let url = "";

    // eslint-disable-next-line no-unused-expressions
    canvasState.threekitEnv ? (
      url = await player.snapshotAsync({
        size: { width: 1280, height: 800 },
        mimeType: 'image/jpg',
        cameraId: camera[1]
      })
    ) : (
      url = localStorage.getItem('snapshot') ?? ""
    );

    const download = document.createElement('a');
    download.setAttribute('href', url);
    download.setAttribute('download', `${canvasState.threekitEnv ? "3D Environment.jpg" : "2D Environment.jpg"}`);
    download.click();
  };

  return (
    <div className='fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-center bg-black bg-opacity-80 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full'>
      <div className="relative w-[675px] h-[688px]">

        <div className="relative w-full h-full bg-white shadow">

          <div className="flex items-center justify-between p-5 pl-10 border-b">
            <h3 className='text-4xl font-light text-black font-arizona'>
              Share the Planner
            </h3>
            {/* eslint-disable-next-line react/destructuring-assignment */}
            <button onClick={props.handleOnClickModal} type="button" className="text-black bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-hide="medium-modal">
              <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className="flex flex-wrap pt-16 p-28 font-haasUnica">
            <div className="w-full">
              <label htmlFor="email" className="text-base font-medium font-haasUnica">Share to email address
                <input onChange={handleOnChangeEmail} value={email} type="email" name="email" id="email" placeholder="Email" className={`w-full py-5 px-4 mt-3 border-2 bg-white ${!errorMessage.error ? 'border-[#ff4d4f]' : 'border-[#7C7C7A]'}`} />
              </label>
              <span className={`text-[#ff4d4f] text-sm transition-opacity duration-200 ease-in opacity-0 ${!errorMessage.error ? 'opacity-100' : ''}`}>{errorMessage.message}</span>
              <button disabled={!errorMessage.error} onClick={handleOnClickShare} type="button" className={`flex justify-center  items-center w-full p-4 text-white mt-[0.15rem] transition duration-100 ease-in ${!errorMessage.error ? "bg-[#7C7C7A] cursor-not-allowed" : "bg-black"} ${shareStatus !== 'idle' && 'pointer-events-none'}`}>
                {
                  shareStatus === 'idle' && 'Send' ||
                  shareStatus === 'loading' && <Loader borderWidth="border-4" height="h-[25px]" width="w-[25px]" color="border-white" /> ||
                  shareStatus === 'succeeded' && <Check />
                }
              </button>
            </div>

            <div className="w-full mt-10">
              <label htmlFor="Link" className="text-base font-medium font-haasUnica">Copy Link
                <input type="url" name="link" id="Link" placeholder="https://site.com" className="w-full py-5 px-4 mt-3 mb-5 border-[#7C7C7A] border-2 bg-white" />
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-between w-full mt-10">
              <p className="w-full text-base font-medium">Export</p>
              <button type="button" className="bg-black text-white w-[210px] p-4 mt-3 text-center hover:cursor-pointer" onClick={takeSnapshot} >Download JPG</button>
              <button onClick={handleOnClickDownload} type="button" className={`bg-black text-white w-[210px] p-4 mt-3 flex justify-center items-center ${downloadStatus !== 'idle' && 'pointer-events-none'}`}>
                {
                  downloadStatus === 'idle' && 'Download PDF' ||
                  downloadStatus === 'loading' && <Loader borderWidth="border-4" height="h-[25px]" width="w-[25px]" color="border-white" /> ||
                  downloadStatus === 'succeeded' && <Check />
                }
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalShare
