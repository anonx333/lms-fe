import { useState } from "react";

const useForm = (initialState) => {
  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setForm((s) => ({ ...s, [name]: files[0] }));
    } else {
      setForm((s) => ({ ...s, [name]: value }));
    }
  };

  return {
    form,
    setForm,
    handleChange,
  };
};

export default useForm;
