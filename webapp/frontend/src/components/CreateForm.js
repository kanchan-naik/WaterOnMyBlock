import annotationsStore from "../stores/annotationsStore";

export default function CreateForm() {
  const store = annotationsStore();
  
  if (store.updateForm._id) return <></>; // does not try to render while we are updating

  return (
    <div>
      <h2>Create annotation</h2>
      <form onSubmit={store.createAnnotation}>
        <input
          onChange={store.updateCreateFormField}
          value={store.createForm.address}
          name="address"
        />
        <input
          onChange={store.updateCreateFormField}
          value={store.createForm.firstName}
          name="firstName"
        />
        <input
          onChange={store.updateCreateFormField}
          value={store.createForm.lastName}
          name="lastName"
        />
        <textarea
          onChange={store.updateCreateFormField}
          value={store.createForm.description}
          name="description"
        />
        <label>
          <input
            type="checkbox"
            onChange={store.updateCreateFormField}
            checked={store.createForm.isAnonymous}
            name="isAnonymous"
          />
          Is Anonymous
        </label>
        <button type="submit">Create annotation</button>
      </form>
    </div>
  );
}

