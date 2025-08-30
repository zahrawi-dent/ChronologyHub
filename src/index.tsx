/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import "./index.css";
import { Layout } from "./Layout";
import ReferenceTable from "./ReferenceTable";
import ChartTab from "./ChartTab";
import StudyMode from "./StudyMode";
import Timeline from "./Timeline";
import NotFound from "./NotFound";

const wrapper = document.getElementById("root");

if (!wrapper) {
  throw new Error("Wrapper div not found");
}


render(
  () => (
    <Router base="chronohub">
      <Route component={Layout}>
        <Route path="/" component={ChartTab} />
        <Route path="/timeline" component={Timeline} />
        <Route path="/table" component={ReferenceTable} />
        <Route path="/study" component={StudyMode} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  ),
  wrapper
);



