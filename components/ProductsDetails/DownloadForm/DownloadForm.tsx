import React, { FC, useState, useEffect } from 'react';
import Image from 'next/image';
import CheckBox from '../../reusable/CheckBox';
import { getKey } from '../../../utils';
import styles from './DownloadForm.module.scss';

type FormPropsType = {
  product?: any;
  images?: Array<string>;
  onClose: () => void;
};

type ProductAttributeType = {
  attribute_code: string;
  value: string;
};

type DownloadItemImageType = {
  url: string;
  checked: boolean;
};

type DownloadItemFileType = {
  ext: string;
  checked: boolean;
  urls: Array<string>;
};

const getFileExtension = (filename: string): null | string => {
  if (!filename) return null;
  const extension = filename.split('.').pop();
  return extension ? extension.toLowerCase() : null;
};

const getFilesArrayFromString = (string: string): Array<string> => {
  if (!string) return [];
  return string.split(',').map(item => item.trim());
};

const getAllFileExtFromString = (string: null | string): Array<string> => {
  if (!string) return [];
  const fileExtArr: Array<string> = [];
  const files = getFilesArrayFromString(string) ?? [];
  files.map(file => {
    const ext = getFileExtension(file) ?? null;
    if (ext && !fileExtArr.includes(ext)) {
      fileExtArr.push(ext);
    }
    return true;
  });
  return fileExtArr;
};

const getAllFilesFromStringByExt = (
  string: null | string,
  extension: null | string
) => {
  if (!string || !extension) return [];

  const fileUrlsArr: Array<string> = [];
  const files = getFilesArrayFromString(string) ?? [];
  files.map(file => {
    const ext = getFileExtension(file) ?? null;
    if (ext && ext === extension) {
      fileUrlsArr.push(`${process.env.API_ENDPOINT}/media/pdf/${file}`);
    }
    return true;
  });
  return fileUrlsArr;
};

const getProductAttributeValueByCode = (
  productAttributes: Array<ProductAttributeType>,
  attributeCode: null | string
): null | string => {
  if (!attributeCode) return null;
  let value: null | string = null;
  productAttributes.map(attribute => {
    if (attributeCode === attribute?.attribute_code) {
      value = attribute.value;
    }
    return true;
  });

  return value;
};

const downloadFiles = (fileUrls: Array<string>) => {
  fileUrls.forEach(url => {
    if (url && url !== '') {
      const link = document.createElement('a');
      link.href = url;
      link.download = url.substring(url.lastIndexOf('/') + 1);
      link.target = '_blank';
      link.click();
    }
  });
};

const DownloadForm: FC<FormPropsType> = ({ onClose, product, images }) => {
  const productAttributes: Array<ProductAttributeType> =
    JSON.parse(product?.visiture_custom_attributes) ?? [];

  // set files 2d
  const files2dAttribute: null | string = getProductAttributeValueByCode(
    productAttributes,
    'file_2d_filename'
  );
  const files2dExtArr: Array<string> =
    getAllFileExtFromString(files2dAttribute);
  const files2dInitArr: Array<DownloadItemFileType> = [];
  files2dExtArr.map(fileExt => {
    const item: DownloadItemFileType = {
      ext: fileExt,
      checked: false,
      urls: getAllFilesFromStringByExt(files2dAttribute, fileExt)
    };
    files2dInitArr.push(item);
    return true;
  });

  // set files 3d
  const files3dAttribute: null | string = getProductAttributeValueByCode(
    productAttributes,
    'file_3d_filename'
  );
  const files3dExtArr: Array<string> =
    getAllFileExtFromString(files3dAttribute);
  const files3dInitArr: Array<DownloadItemFileType> = [];
  files3dExtArr.map(fileExt => {
    const item: DownloadItemFileType = {
      ext: fileExt,
      checked: false,
      urls: getAllFilesFromStringByExt(files3dAttribute, fileExt)
    };
    files3dInitArr.push(item);
    return true;
  });

  // set images
  const imagesInitArr: Array<DownloadItemImageType> = [];
  images?.map(image => {
    const item: DownloadItemImageType = {
      url: image,
      checked: false
    };
    imagesInitArr.push(item);
    return true;
  });

  // set checkbox vars
  const [cbSelectAll, setCbSelectAll] = useState<boolean>(false);

  const [cbAllImages, setCbAllImages] = useState<boolean>(false);
  const [cbImages, setCbImages] =
    useState<Array<DownloadItemImageType>>(imagesInitArr);

  const [cbAll2dFiles, setCbAll2dFiles] = useState<boolean>(false);
  const [cb2dFiles, setCb2dFiles] =
    useState<Array<DownloadItemFileType>>(files2dInitArr);

  const [cbAll3dFiles, setCbAll3dFiles] = useState<boolean>(false);
  const [cb3dFiles, setCb3dFiles] =
    useState<Array<DownloadItemFileType>>(files3dInitArr);

  const [cbSpecSheet, setCbSpecSheet] = useState<boolean>(false);

  // disable page scroll when form is opened
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // eslint-disable-next-line no-unused-vars
  const handleFormOnClose = () => {
    onClose();
  };

  const handleSelectSpecSheet = (checked: boolean) => {
    setCbSpecSheet(checked);
    if (!checked) {
      setCbSelectAll(checked);
    }
  };

  const handelSelectImage = (index: number, checked: boolean) => {
    const items: Array<DownloadItemImageType> = [...cbImages];
    items[index].checked = checked;
    setCbImages(items);
    if (!checked) {
      setCbAllImages(checked);
      setCbSelectAll(checked);
    }
  };

  const handleSelectAllImages = (checked: boolean) => {
    setCbAllImages(checked);
    cbImages.map((item, index) => {
      handelSelectImage(index, checked);
      return true;
    });
  };

  const handleSelect2dFile = (index: number, checked: boolean) => {
    const items: Array<DownloadItemFileType> = [...cb2dFiles];
    items[index].checked = checked;
    setCb2dFiles(items);
    if (!checked) {
      setCbAll2dFiles(checked);
      setCbSelectAll(checked);
    }
  };

  const handleSelectAll2dFiles = (checked: boolean) => {
    setCbAll2dFiles(checked);
    cb2dFiles.map((item, index) => {
      handleSelect2dFile(index, checked);
      return true;
    });
  };

  const handleSelect3dFile = (index: number, checked: boolean) => {
    const items: Array<DownloadItemFileType> = [...cb3dFiles];
    items[index].checked = checked;
    setCb3dFiles(items);
    if (!checked) {
      setCbAll3dFiles(checked);
      setCbSelectAll(checked);
    }
  };

  const handleSelectAll3dFiles = (checked: boolean) => {
    setCbAll3dFiles(checked);
    cb3dFiles.map((item, index) => {
      handleSelect3dFile(index, checked);
      return true;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setCbSelectAll(checked);
    handleSelectSpecSheet(checked);
    handleSelectAllImages(checked);
    handleSelectAll2dFiles(checked);
    handleSelectAll3dFiles(checked);
  };

  const handleOnDownload = () => {
    const downloadUrls: Array<string> = [];

    // todo implement this when magento attribute for spec sheet is added
    // if(cbSpecSheet) {
    // }

    if (cb2dFiles) {
      cb2dFiles.forEach(file => {
        if (file.checked) {
          downloadUrls.push(...file.urls);
        }
      });
    }

    if (cb3dFiles) {
      cb3dFiles.forEach(file => {
        if (file.checked) {
          downloadUrls.push(...file.urls);
        }
      });
    }

    if (cbImages) {
      cbImages.forEach(image => {
        if (image.checked) {
          downloadUrls.push(image.url);
        }
      });
    }
    downloadFiles(downloadUrls);
  };

  return (
    <div id="pdp-download-form" className={styles.FormOverlay}>
      <div className={styles.FormContainer}>
        <div className="container-with-separator">
          <div className={styles.Header}>
            <div>Download Assets</div>
            <div onClick={handleFormOnClose}>
              <button type="button">X</button>
            </div>
          </div>
        </div>
        <div className={styles.Elements}>
          <div className="container-with-separator">
            <CheckBox
              checked={cbSelectAll}
              label="SelectAll"
              onCheck={() => handleSelectAll(!cbSelectAll)}
            />
          </div>
          <div className="container-with-separator">
            <CheckBox
              checked={cbSpecSheet}
              label="Spec Sheet"
              onCheck={() => handleSelectSpecSheet(!cbSpecSheet)}
            />
          </div>
          <div className="container-with-separator">
            <CheckBox
              checked={cbAllImages}
              label="All Images"
              onCheck={() => handleSelectAllImages(!cbAllImages)}
            />
            <div className={styles.AllImages}>
              {cbImages?.map((image: DownloadItemImageType, index: number) => (
                <div
                  key={getKey(`threekit-download-image-${index}`)}
                  className={styles.ImageContainer}
                >
                  <Image
                    className={styles.Image}
                    src={image?.url}
                    alt="no-image"
                    fill
                  />
                  <CheckBox
                    className={styles.CheckBox}
                    checked={image?.checked}
                    label=""
                    onCheck={() => handelSelectImage(index, !image.checked)}
                  />
                </div>
              )) ?? null}
            </div>
          </div>
          <div className="container-with-separator">
            <div className={styles.ContainerChkBox30}>
              <CheckBox
                checked={cbAll2dFiles}
                label="All 2D Files"
                onCheck={() => handleSelectAll2dFiles(!cbAll2dFiles)}
              />
              {cb2dFiles?.map((file: DownloadItemFileType, index: number) => (
                <CheckBox
                  checked={file.checked}
                  label={file.ext}
                  onCheck={() => handleSelect2dFile(index, !file.checked)}
                />
              )) ?? null}
            </div>
          </div>
          <div className="container">
            <div className={styles.ContainerChkBox30}>
              <CheckBox
                checked={cbAll3dFiles}
                label="All 3D Files"
                onCheck={() => handleSelectAll3dFiles(!cbAll3dFiles)}
              />
              {cb3dFiles?.map((file: DownloadItemFileType, index: number) => (
                <CheckBox
                  checked={file.checked}
                  label={file.ext}
                  onCheck={() => handleSelect3dFile(index, !file.checked)}
                />
              )) ?? null}
            </div>
          </div>
        </div>
        <div className="container-with-separator" />
        <div className={styles.Footer}>
          <button type="button" onClick={handleOnDownload}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

DownloadForm.defaultProps = {
  product: null,
  images: []
};

export default DownloadForm;
