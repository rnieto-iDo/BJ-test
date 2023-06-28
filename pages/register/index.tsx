import RadioButton from '@/components/reusable/RadioButton';
import { Button, Input } from '@witt-team/athens-component-library';
import React, { useEffect, useRef, useState } from 'react';
import cs from 'classnames';
import LineSeparatorBlock from 'blocks/separator-blocks/line-separator-block/LineSeparatorBlock';
import CheckBox from '@/components/reusable/CheckBox';
import EmptySeparatorBlock from 'blocks/separator-blocks/empty-separator-block/EmptySeparatorBlock';
import { useRouter } from 'next/router';
import { handleInputNumber, truncateString } from 'helpers/utils';
import { NUMBER_REGEX, PHONE_NUMBER_REGEX } from 'constants/common';
import { CloseOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'hooks/reduxOverwriteHooks';
import {
  getRegisterPageContent,
  selectRegisterPageCmsData
} from 'store/reducers/pageSlice';
import styles from '../../styles/pages/Register.module.scss';

const YES = 'Yes';
const NO = 'No';

type HavingLicence = 'Yes' | 'No';

const Register = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectRegisterPageCmsData);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [hearAbout, setHearAbout] = useState<string>('');
  const [licence, setLicence] = useState<HavingLicence>(NO);
  const [businessName, setBusinessName] = useState<string>('');
  const [resaleNumber, setResaleNumber] = useState<string>('');
  const [webSite, setWebSite] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [marketingEmails, setMarketingEmails] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(getRegisterPageContent());
  }, [dispatch]);

  const isFormValid = () =>
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !country ||
    !hearAbout ||
    (licence === YES &&
      (!businessName || !address || !city || !state || !postalCode));

  return (
    <div className={styles.Main}>
      <div className={styles.FormContainer}>
        <div className={styles.TitleContainer}>
          <p className={styles.Title}>{cmsData?.title}</p>
          <p className={styles.SubTitle}>{cmsData?.subTitle}</p>
        </div>
        <div className={styles.FormContent}>
          <Input
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
          <Input
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
          <Input
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={e =>
              handleInputNumber(e.target.value, PHONE_NUMBER_REGEX, () =>
                setPhoneNumber(e.target.value)
              )
            }
          />
          <Input
            placeholder="Country"
            value={country}
            onChange={e => setCountry(e.target.value)}
          />
          <Input
            placeholder="How did you hear about us?"
            className={styles.GridItemFullWidth}
            value={hearAbout}
            onChange={e => setHearAbout(e.target.value)}
          />
          <div className={cs(styles.YesNoContainer, styles.GridItemFullWidth)}>
            <p className={styles.Label}>
              Are you a licensed designer/trade organization?
            </p>
            <div className={styles.RadioButtonContainer}>
              <RadioButton
                checked={licence === YES}
                label="Yes"
                onChecked={() => setLicence(YES)}
              />
              <RadioButton
                checked={licence === NO}
                label="No"
                onChecked={() => setLicence(NO)}
              />
            </div>
          </div>
          {licence === YES && (
            <div
              className={cs(
                styles.GridItemFullWidth,
                styles.FormContentWithoutPadding
              )}
            >
              <Input
                placeholder="Business Name"
                className={styles.GridItemFullWidth}
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
              />
              <Input
                placeholder="Resale Number (Optional)"
                value={resaleNumber}
                onChange={e =>
                  handleInputNumber(e.target.value, NUMBER_REGEX, () =>
                    setResaleNumber(e.target.value)
                  )
                }
              />
              <Input
                placeholder="Website (Optional)"
                value={webSite}
                onChange={e => setWebSite(e.target.value)}
              />
              <Input
                placeholder="Street Address"
                className={styles.GridItemFullWidth}
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
              <div
                className={cs(
                  styles.ThreeInputsContainer,
                  styles.GridItemFullWidth
                )}
              >
                <Input
                  placeholder="City"
                  className={styles.City}
                  value={city}
                  onChange={e => setCity(e.target.value)}
                />
                <Input
                  placeholder="State"
                  value={state}
                  onChange={e => setState(e.target.value)}
                />
                <Input
                  placeholder="Postal Code"
                  className={styles.PostalCode}
                  value={postalCode}
                  onChange={e =>
                    handleInputNumber(e.target.value, NUMBER_REGEX, () =>
                      setPostalCode(e.target.value)
                    )
                  }
                />
              </div>
              <LineSeparatorBlock
                className={cs(styles.GridItemFullWidth, styles.Separator)}
              />
              <div
                className={cs(
                  styles.DocumentsContainer,
                  styles.GridItemFullWidth
                )}
              >
                <p className={styles.Title}>
                  {cmsData?.documentSection?.documentTitle}
                </p>
                <p className={styles.Content}>
                  {cmsData?.documentSection?.documentDescription}
                </p>
                <div className={styles.FileContainer}>
                  <div
                    className={styles.UploadButton}
                    onClick={() => inputRef?.current?.click()}
                  >
                    Upload File
                  </div>
                  <input
                    type="file"
                    ref={inputRef}
                    className={styles.Input}
                    onChange={e => {
                      if (e.target.files) {
                        setFile(e.target.files[0]);
                      }
                    }}
                  />
                  {!file ? (
                    <div className={styles.NothingSelected}>
                      No files selected
                    </div>
                  ) : (
                    <div className={styles.SelectedFile}>
                      <p className={styles.Text}>
                        {truncateString(file?.name, 12)}
                      </p>
                      <CloseOutlined
                        rev=""
                        style={{ color: 'white' }}
                        onClick={() => setFile(null)}
                      />
                    </div>
                  )}
                </div>
              </div>
              <LineSeparatorBlock
                className={cs(styles.GridItemFullWidth, styles.Separator)}
              />
            </div>
          )}
          <div className={cs(styles.GridItemFullWidth, styles.SubmitContainer)}>
            <Button
              variant="filled"
              size="full-width"
              disabled={isFormValid()}
              className={styles.ButtonStyle}
              onClick={() => {
                router.push('/register/success');
                console.log({
                  firstName,
                  lastName,
                  phoneNumber,
                  country,
                  hearAbout,
                  licence:
                    licence === YES
                      ? {
                          businessName,
                          resaleNumber,
                          webSite,
                          address,
                          city,
                          state,
                          postalCode,
                          file
                        }
                      : null
                });
              }}
            >
              Create Account
            </Button>
            <div className={styles.CheckBoxStyle}>
              <CheckBox
                label="By registering, you agree to receive marketing emails lorem ipsum"
                checked={marketingEmails}
                onCheck={() => setMarketingEmails(!marketingEmails)}
              />
            </div>
            <div
              className={styles.ExistingAccount}
              onClick={() => router.push('/login')}
            >
              I already have an account
            </div>
          </div>
        </div>
      </div>
      <EmptySeparatorBlock />
    </div>
  );
};

export default Register;
