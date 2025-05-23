import { create } from "zustand";
import axios from "axios";

const API_BASE_URL = "http://ec2-23-22-165-228.compute-1.amazonaws.com:8080";

const annotationsStore = create((set) => ({
  annotations: null,

  createForm: {
    address: "",
    firstName: "",
    lastName: "",
    description: "",
    isAnonymous: false,
  },

  updateForm: {
    _id: null,
    address: "",
    firstName: "",
    lastName: "",
    description: "",
    isAnonymous: false,
  },

  fetchAnnotations: async () => {
    const res = await axios.get(`${API_BASE_URL}/annotations`);
    set({
      annotations: res.data.annotations,
    });
  },

  updateCreateFormField: (e) => {
    const { name, value, type, checked } = e.target;

    set((state) => {
      return {
        createForm: {
          ...state.createForm,
          [name]: type === "checkbox" ? checked : value,
        },
      };
    });
  },

  createAnnotation: async (e) => {
    e.preventDefault();

    const { createForm, annotations } = annotationsStore.getState();
    const res = await axios.post(`${API_BASE_URL}/annotations`, createForm);

    set({
      notes: [...annotations, res.data.annotation],
      createForm: {
        address: "",
        firstName: "",
        lastName: "",
        description: "",
        isAnonymous: false,
      },
    });
  },

  deleteAnnotation: async (_id) => {
    await axios.delete(`${API_BASE_URL}/annotations/${_id}`);
    const { annotations } = annotationsStore.getState();
    const newAnnotations = annotations.filter((annotation) => {
      return annotation._id !== _id;
    });
    set({ annotations: newAnnotations });
  },

  toggleUpdate: ({
    _id,
    address,
    firstName,
    lastName,
    description,
    isAnonymous,
  }) => {
    set({
      updateForm: {
        address,
        firstName,
        lastName,
        description,
        isAnonymous,
        _id,
      },
    });
  },

  // Update form field for the update form (address, firstName, etc.)
  handleUpdateFieldChange: (e) => {
    const { name, value, type, checked } = e.target;
    set((state) => {
      return {
        updateForm: {
          ...state.updateForm,
          [name]: type === "checkbox" ? checked : value,
        },
      };
    });
  },

  updateAnnotation: async (e) => {
    e.preventDefault();

    const {
      updateForm: {
        address,
        firstName,
        lastName,
        description,
        isAnonymous,
        _id,
      },
      annotations,
    } = annotationsStore.getState();

    // Send the update request
    const res = await axios.put(`${API_BASE_URL}/annotations/${_id}`, {
      address,
      firstName,
      lastName,

      description,
      isAnonymous,
    });

    // Update state
    const newAnnotations = [...annotations];
    const annotationIndex = annotations.findIndex((annotation) => {
      return annotation._id === _id;
    });
    newAnnotations[annotationIndex] = res.data.annotation;

    set({
      annotations: newAnnotations,
      updateForm: {
        _id: null,
        address: "",
        firstName: "",
        lastName: "",
        description: "",
        isAnonymous: "",
      },
    });
  },
}));

export default annotationsStore;
