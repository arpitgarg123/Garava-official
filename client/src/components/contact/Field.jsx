import React from 'react'

const Field = ({ id, label, name, value, onChange, onBlur, required, placeholder, error, type = "text", as, rows }) => {
     const Comp = as === "textarea" ? "textarea" : "input";
  return (
     <div>
      <label htmlFor={id} className="text-md font-medium">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <Comp
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        placeholder={placeholder}
        type={as === "textarea" ? undefined : type}
        rows={rows}
        className={`mt-1 w-full resize-none border-b border-gray-400 bg-background px-3 py-2 outline-none ring-0 transition focus:border-gray-800  focus:ring-primary ${
          error ? "border-red-300" : "border-muted"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

export default Field