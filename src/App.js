import "./App.css";
import SectionTitle from "./components/SectionTitle";
import AccordionList from "./components/AccordionList";
import guide from "./data/guide";
import dsa from "./data/dsa";
import interview from "./data/interview";

function App() {
  return (
    <div className="App container py-3">
      <SectionTitle
        title="StudyPad Reference"
        subtitle="Code + Notes, organized by sections"
      />
      <AccordionList items={[guide]} defaultActiveKey={"0"} />
      <AccordionList items={[dsa]} defaultActiveKey={"0"} />
      <AccordionList items={[interview]} defaultActiveKey={"0"} />
    </div>
  );
}

export default App;
