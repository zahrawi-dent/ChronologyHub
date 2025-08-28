/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import { lazy } from "solid-js";
import "./index.css";
import { Layout } from "./Layout";

const wrapper = document.getElementById("root");

if (!wrapper) {
  throw new Error("Wrapper div not found");
}

function About() {
  return <div>about</div>;
}


render(
  () => (
    <Router root={Layout}>
      <Route path="/" component={lazy(() => import("./ChartTab"))} />
      <Route path="/table" component={lazy(() => import("./ReferenceTable"))} />
    </Router>
  ),
  wrapper
);
