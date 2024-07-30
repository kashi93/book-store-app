import { createId } from '@paralleldrive/cuid2';
import { CSSProperties, useState } from 'react';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import Select, { Props, StylesConfig } from 'react-select';
import CreatableSelect from 'react-select/creatable';

type Type =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week"
  | "text-area"
  | "drop-down";

interface Default {
  label?: string;
  type?: Type;
  placeholder?: string;
  required?: boolean;
  value?: any
  onChange: (value: any) => void
  noBorder?: boolean
  readonly?: boolean
  style?: CSSProperties
}

export interface Option {
  value: any;
  label: string;
}

interface Input extends Default {
  suffix?: React.ReactNode
}

interface DropDown extends Default {
  type: "drop-down";
  loading?: boolean;
  list: Option[];
  createAble?: boolean
  clearAble?: boolean,
  menuPortalTarget?: HTMLElement
}


interface CreateAbleDropDown extends DropDown {
  createAble: true;
  onCreated: (val: Option) => void;
}

type TextInputProp =
  | (Input & { type?: Exclude<Type, 'drop-down'> })
  | (DropDown & { type: 'drop-down', createAble?: false })
  | CreateAbleDropDown;


const REACT_SELECT_NO_BORDER: StylesConfig = {
  control: (styles, { isDisabled }) => ({
    ...styles,
    borderRadius: 0,
    borderWidth: 0,
    border: 0,
    boxShadow: 'none',
    backgroundColor: isDisabled ? "rgb(248 250 252 / var(--tw-bg-opacity))" : styles.backgroundColor
  }),
  menu: (styles) => ({
    ...styles,
    borderRadius: 0,
    borderWidth: 0,
  }),
}

const REACT_SELECT_DEFAULT: StylesConfig = {
  control: (styles, { isDisabled }) => ({
    ...styles,
    backgroundColor: isDisabled ? "rgb(248 250 252 / var(--tw-bg-opacity))" : styles.backgroundColor,
  }),
  // menuPortal: (provided) => ({
  //   ...provided,
  //   zIndex: 9999,
  // }),
}


export default function TextInput({ type = "text", placeholder, label, required = false, value, onChange, noBorder, readonly, style, ...props }: TextInputProp) {
  const [id] = useState(createId());

  const getInput = () => {
    switch (type) {
      case "text-area":
        return (
          <textarea
            id={id}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={style}
            autoComplete='new-password'
            readOnly={readonly}
            disabled={readonly}
          />
        )
      case "date":
        return (
          <Flatpickr
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={value}
            onChange={([date]) => {
              if (date) {
                onChange(date.toISOString());
              } else {
                onChange("");
              }
            }}
          />
        )

      case "drop-down":
        const { loading, list, createAble, clearAble, menuPortalTarget } = props as DropDown;
        const prop: Props = {
          id,
          menuPosition: "fixed",
          isLoading: loading,
          options: list,
          isClearable: clearAble,
          value,
          onChange: (val, meta) => onChange({ val, meta }),
          styles: noBorder ? REACT_SELECT_NO_BORDER : REACT_SELECT_DEFAULT,
          menuPortalTarget,
          menuPlacement: "auto",
        };

        if (createAble) {
          const handleCreateNewDropDownList = (value: string) => {
            const { onCreated } = props as CreateAbleDropDown;

            if (value.trim() == "") return;
            onCreated({ value: createId(), label: value });
          };

          return (
            <CreatableSelect
              {...prop}
              onCreateOption={handleCreateNewDropDownList}
            />
          )
        }

        return (
          <Select
            {...prop}
          />
        )
      default:
        const { suffix } = props as Input;
        return (
          <div className="relative">
            <input
              type={type}
              id={id}
              className={`bg-gray-50 ${!noBorder && "border border-gray-300"} text-gray-900 text-sm ${!noBorder && "rounded-lg"}  ${!readonly && "focus:ring-blue-500 focus:border-blue-500"} block w-full p-2.5`}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              readOnly={readonly}
              disabled={readonly}
              style={style}
              autoComplete='new-password'
            />
            {suffix &&
              <div className="absolute top-2.5 right-3 text-slate-300 text-xl p-0 leading-none" >
                {suffix}
              </div>
            }
          </div>
        )
    }
  }

  return (
    <div>
      {label &&
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">
          {label} {required ? <span className='text-red-600 font-bold text-base'>*</span> : <span className='text-slate-400 text-xs'>(Optional)</span>}
        </label>
      }
      {getInput()}
    </div>
  )
}
