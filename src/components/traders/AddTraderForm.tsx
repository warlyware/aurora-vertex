import { useFormik } from "formik";
import { FormInputWithLabel } from "../UI/forms/form-input-with-label";
import { PrimaryButton } from "../UI/buttons/primary-button";
import { BASE_URL } from "@/constants";
import axios from "axios";
import showToast from "@/utils/show-toast";

type AddTraderFormProps = {
  refetch: () => void;
  className?: string;
};

export default function AddTraderForm({ refetch, className }: AddTraderFormProps) {
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      address: "",
      name: "",
      description: "",
    },
    onSubmit: async (values) => {
      console.log(values);

      const { data, status } = await axios.post(`${BASE_URL}/api/add-trader`, {
        address: values.address,
        name: values.name,
        description: values.description,
      });

      if (status === 200) {
        showToast({
          primaryMessage: "Trader added successfully",
        });
        refetch();
      } else {
        showToast({
          primaryMessage: "Failed to add trader",
          error: data,
        });
      }
    },
  });

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-y-6 ${className}`}>
      <FormInputWithLabel
        label="Name"
        name="name"
        value={values.name}
        onChange={handleChange}
      />
      <FormInputWithLabel
        label="Address"
        name="address"
        value={values.address}
        onChange={handleChange}
      />
      <FormInputWithLabel
        label="Description"
        name="description"
        value={values.description}
        onChange={handleChange}
      />
      <PrimaryButton
        type="submit"
      >
        Add Trader
      </PrimaryButton>
    </form>
  );
}