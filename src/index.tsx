/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import "./index.css";
import { Layout } from "./Layout";
import ReferenceTable from "./ReferenceTable";
import ChartTab from "./ChartTab";
import StudyMode from "./StudyMode";

const wrapper = document.getElementById("root");

if (!wrapper) {
  throw new Error("Wrapper div not found");
}


render(
  () => (
    <Router root={Layout}>
      <Route path="/" component={ChartTab} />
      <Route path="/table" component={ReferenceTable} />
      <Route path="/study" component={StudyMode} />
    </Router>
  ),
  wrapper
);
