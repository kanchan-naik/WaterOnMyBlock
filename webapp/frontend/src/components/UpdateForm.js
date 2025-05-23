import annotationsStore from "../stores/annotationsStore";

export default function UpdateForm() {
  const store = annotationsStore(); // Subscribe to store

  // Prevent form rendering if updateForm._id is null
  if (!store.updateForm._id) return <></>;

  return (
    <div>
      <h2>Update annotation</h2>
      <form onSubmit={store.updateAnnotation}>
        <input
          onChange={store.handleUpdateFieldChange} // Ensure onChange is set
          value={store.updateForm.address}
          name="address"
        />
        <input
          onChange={store.handleUpdateFieldChange} // Ensure onChange is set
          value={store.updateForm.firstName}
          name="firstName"
        />
        <input
          onChange={store.handleUpdateFieldChange} // Ensure onChange is set
          value={store.updateForm.lastName}
          name="lastName"
        />
        <textarea
          onChange={store.handleUpdateFieldChange} // Ensure onChange is set
          value={store.updateForm.description}
          name="description"
        />
        <label>
          <input
            type="checkbox"
            onChange={store.handleUpdateFieldChange} // Ensure onChange is set
            checked={store.updateForm.isAnonymous}
            name="isAnonymous"
          />
          Is Anonymous
        </label>
        <button type="submit">Update annotation</button>
      </form>
    </div>
  );
}


