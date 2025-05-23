import annotationsStore from "../stores/annotationsStore";
import Annotation from "./Annotation";

export default function Annotations() {
  const store = annotationsStore(); 
  
  return (
    <div>
      <h2>Annotations:</h2>
      {store.annotations && 
        store.annotations.map((annotation) => {
            return <Annotation annotation={annotation} key={annotation._id} />
        })}
    </div>
  );
}

