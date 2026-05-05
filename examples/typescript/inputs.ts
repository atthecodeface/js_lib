import * as log from "./log.js";
import * as html from "./html.js";

class Main {
  div: html.HtmlElement;
  log: log.Log;
  log_src: log.Logger;
  constructor() {
    this.log = new log.Log("", log.Severity.Fatal, log.Severity.Verbose);
    this.log_src = new log.Logger(this.log, "main");
    this.div = new html.HtmlElement(
      document.getElementById("TestArea")! as HTMLDivElement,
    );
    this.div.add_input_button(
      "Alert button",
      () => window.alert("Alert button clicked!"),
      { classes: "test item" },
    );

    this.div.add_input_text("Name", "Value", this.text_input.bind(this), {
      classes: "test item",
    });

    const radio_table = new html.Table("test item");
    radio_table.add_body([
      html.HtmlElement.new_ele("div", {}, [], (e: html.HtmlElement) => {
        e.add_input_radio(
          "radio1",
          "sel1",
          true,
          this.radio1_selected.bind(this),
          { classes: "radio1 button" },
        ).set_input_checked(true);
        e.add_label("sel1").add_content("Radio Item 1");
      }),
      html.HtmlElement.new_ele("div", {}, [], (e: html.HtmlElement) => {
        e.add_input_radio(
          "radio1",
          "sel2",
          true,
          this.radio1_selected.bind(this),
          { classes: "radio1 button" },
        );
        e.add_label("sel2").add_content("Radio Item 2");
      }),
    ]);
    this.div.add_content(radio_table.as_html());

    const radio_table2 = new html.Table("test item");
    radio_table2.add_body([
      html.HtmlElement.new_ele("div", {}, [], (e: html.HtmlElement) => {
        e.add_input_radio(
          "radio2",
          "radio2_sel1",
          true,
          this.radio2_selected.bind(this),
          { classes: "radio2 button" },
        );
        e.add_label("radio2_sel1").add_content("Opt radio 1");
      }),
      html.HtmlElement.new_ele("div", {}, [], (e: html.HtmlElement) => {
        e.add_input_radio(
          "radio2",
          "radio2_sel2",
          true,
          this.radio2_selected.bind(this),
          { classes: "radio2 button" },
        );
        e.add_label("radio2_sel2").add_content("Opt radio 2");
      }),
    ]);
    this.div.add_content(radio_table2.as_html());

    const check_table = new html.Table("test item");
    check_table.add_body([
      html.HtmlElement.new_ele("div", {}, [], (e: html.HtmlElement) => {
        e.add_input_checkbox(
          "checkbox1",
          (_event, checked) => {
            this.checked("checkbox1", checked);
          },
          { classes: "check1 button" },
        );
        e.add_label("checkbox1").add_content("Checkbox 1!");
      }),
      html.HtmlElement.new_ele("div", {}, [], (e: html.HtmlElement) => {
        e.add_input_checkbox(
          "checkbox2",
          (_event, checked) => {
            this.checked("checkbox2", checked);
          },
          { classes: "check2 button" },
        );
        e.add_label("checkbox2").add_content("Checkbox 2!");
      }),
    ]);
    this.div.add_content(check_table.as_html());

    this.div.add_input_dropdown(
      "dropdown_any",
      [
        ["value1", "label1"],
        ["value2", "label2"],
      ],
      "value1",
      false,
      false,
      this.dropdown.bind(this),
      { classes: "test item" },
    );

    this.div.add_input_dropdown(
      "dropdown_multiple",
      [
        ["value1", "label1"],
        ["value2", "label2"],
      ],
      null,
      false,
      true,
      this.dropdown_many.bind(this),
      { classes: "test item" },
    );

    this.div.add_input_range(
      "float_range",
      { min: 100, max: 110, step: 0.1 },
      this.float_range.bind(this),
      { classes: "test item" },
    );

    this.div.add_input_range(
      "int_range",
      { min: -50, max: 50, step: 1 },
      (_e, value) => {
        this.int_range(value, "-50 to 50");
      },
      { classes: "test item" },
    );

    this.div.add_input_range(
      "int_range",
      { min: -500, max: 0, step: 10 },
      (_e, value) => {
        this.int_range(value, "-500 to 0");
      },
      { classes: "test item" },
    );
  }

  text_input(_e: InputEvent, value: string) {
    this.log_src.info("Text input " + value);
  }

  radio1_selected(_e: Event, value: string) {
    this.log_src.info("Radio 1 selected " + value);
  }
  radio2_selected(_e: Event, value: string) {
    this.log_src.info("Radio 2 selected " + value);
  }

  checked(which: string, checked: boolean) {
    this.log_src.info(`Checkbox selected ${which} ${checked}`);
  }

  dropdown(event: Event, value: string) {
    this.log_src.info(`Dropdown selected ${value}`);
    console.log(event);
  }

  dropdown_many(event: Event, value: string) {
    this.log_src.info(`Dropdown mulitple selected ${value}`);
    const e = event.target as HTMLSelectElement;
    if (e.selectedOptions.length > 1) {
      console.log("Multiple options selected ", e.selectedOptions.length);
    }
  }

  float_range(_e: Event, value: number): void {
    this.log_src.info(`Entered a float value ${value}`);
  }

  int_range(value: number, selector: string): void {
    this.log_src.info(`Entered an integer value for ${selector} of ${value}`);
  }
}

(window as any).main = null;

function complete_init() {
  (window as any).main = new Main();
}

window.addEventListener("load", (_e) => {
  complete_init();
});
