import { useStateMachine } from 'little-state-machine';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import updateAction from '../../actions/updateAction';
import {
  Individual,
  KaryotypicSex,
  Sex,
  VitalStatus_Status,
} from '../../interfaces/phenopackets/schema/v2/core/individual';
import { ICustomFormData } from '../../types';
import Input from '../individual/Input';
import Select from '../individual/Select';
import NextButton from './form/NextButton';
import { useNextUrl } from './layouts/Layout';

export interface IIndividualFormData {
  subject: Partial<Individual>;
  customFormData: ICustomFormData;
}

export default function EditIndividual() {
  const navigate = useNavigate();
  const { nextUrl } = useNextUrl();
  const { actions, state } = useStateMachine({ updateAction });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IIndividualFormData>({
    defaultValues: {
      subject: state.phenoPacket.subject,
      customFormData: state.customFormData,
    },
  });

  const doSubmit = async (formData: IIndividualFormData) => {
    await actions.updateAction({
      ...state,
      phenoPacket: {
        ...state.phenoPacket,
        subject: {
          alternateIds: [],
          dateOfBirth: undefined,
          gender: undefined,
          karyotypicSex: KaryotypicSex.UNKNOWN_KARYOTYPE,
          taxonomy: undefined,
          timeAtLastEncounter: undefined,
          id: '',
          sex: Sex.UNKNOWN_SEX,
          vitalStatus: undefined,
          ...formData.subject,
        },
      },
      customFormData: { ...state.customFormData, ...formData.customFormData },
    });
    nextUrl !== null && navigate(nextUrl);
  };
  return (
    <form onSubmit={handleSubmit(doSubmit)} className="mt-5 max-w-xl">
      <h2>Individual</h2>
      <div className="my-4">
        <Input type="text" label="Local UDP ID" {...register('subject.id')} />
      </div>
      <div className="my-4">
        <Select
          label="Biological sex"
          {...register('subject.sex')}
          options={[
            { value: Sex.UNKNOWN_SEX.toString(), label: 'Unknown' },
            { value: Sex.MALE.toString(), label: 'Male' },
            { value: Sex.FEMALE.toString(), label: 'Female' },
            { value: Sex.UNRECOGNIZED.toString(), label: 'Unrecognized' },
            { value: Sex.OTHER_SEX.toString(), label: 'Other' },
          ]}
        />
        {errors?.subject?.sex && (
          <p className="text-red-500">{errors.subject.sex.message}</p>
        )}
      </div>
      <div className="my-4">
        <Select
          {...register('subject.vitalStatus.status')}
          label="Vital status"
          options={[
            {
              value: VitalStatus_Status.UNKNOWN_STATUS.toString(),
              label: 'Unknown',
            },
            { value: VitalStatus_Status.ALIVE.toString(), label: 'Alive' },
            {
              value: VitalStatus_Status.DECEASED.toString(),
              label: 'Deceased',
            },
          ]}
        />
        {errors?.subject?.vitalStatus && (
          <p className="text-red-500">{errors.subject.vitalStatus.message}</p>
        )}
      </div>
      <div className="my-4">
        <Input
          type="date"
          label="Date of birth"
          {...register('subject.dateOfBirth')}
        />
        {errors?.subject?.dateOfBirth && (
          <p className="text-red-500">{errors.subject.dateOfBirth.message}</p>
        )}
      </div>
      <div className="my-4">
        {/* <YearMonthPicker {...register('customFormData.ageAtOnset')} /> */}
      </div>
      <div className="my-4">
        <Input
          type="number"
          label="Age of mother at time of referral"
          {...register('customFormData.motherAge')}
        />
      </div>
      <div className="my-4">
        <Input
          type="number"
          label="Age of father at time of referral"
          {...register('customFormData.fatherAge')}
        />
      </div>
      <div className="my-4">
        <Select
          label="Ethnicity of patient"
          {...register('customFormData.ethnicity')}
          options={[
            'Unknown',
            'African',
            'American',
            'Asian',
            'European',
            'Latino',
            'Middle East',
            'Oceanian',
          ].map((x) => ({ label: x, value: x }))}
        />
        {errors?.customFormData?.ethnicity && (
          <p className="text-red-500">
            {errors.customFormData?.ethnicity.message}
          </p>
        )}
      </div>
      {/* <div className="my-4">
        <label htmlFor="onsetAge" className="">
          Age at symptom onset
        </label>
        <select name="onsetAge"></select>
        {errors?.onsetAge && <p className="text-red-500">{errors.id.message}</p>}
      </div> */}
      <div className="my-4">
        <label htmlFor="customFormData.referringUdp">Referring UDP</label>
        <textarea
          id="customFormData.referringUdp"
          {...register('customFormData.referringUdp')}
          className="block p-2 w-full rounded border border-gray-300 shadow-sm focus:border-udni-teal focus:ring-4 focus:outline-none focus:ring-udni-teal-100"
        ></textarea>
      </div>
      <NextButton />
    </form>
  );
}
