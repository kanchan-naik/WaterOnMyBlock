import annotationsStore from "../stores/annotationsStore";

export default function Annotation({ annotation }) {
  // Access the methods directly, without subscribing to the entire store
  const deleteAnnotation = annotationsStore(state => state.deleteAnnotation);
  const toggleUpdate = annotationsStore(state => state.toggleUpdate);

  return (
    <div key={annotation._id}>
      <h3>{annotation.address}</h3>
      <button onClick={() => deleteAnnotation(annotation._id)}>
        Delete annotation
      </button>
      <button onClick={() => toggleUpdate(annotation)}>
        Update annotation
      </button>
    </div>
  );
}



  