export const DEFAULTS = {
  free_form_text: `Product listing update: The following item has been submitted for catalogue entry review.

Product reference: SC16-F22-NX
Description: The product is a 16-bit, dual-channel successive approximation ADC manufactured by Texas Instruments, part number ADS8688IPWR. It operates from a single 5V supply and supports an input voltage range of plus or minus 10V, plus or minus 5V, plus or minus 2.5V, 0 to 10V, and 0 to 5V, selectable per channel. The device is housed in a 24-pin TSSOP package. It is RoHS compliant and AEC-Q100 qualified for automotive and industrial applications. Current stock is 847 units held at the Leeds distribution centre. The list price is 12 pounds and 74 pence per unit. A volume discount of 8 percent applies for orders above 500 units. Lead time for replenishment is 14 weeks from the manufacturer. The datasheet reference is SBAS605C and the product is categorised under Data Acquisition, Analogue to Digital Converters.`,
  entities: [
    { label: "Part Number",      definition: "The manufacturer part number for this component" },
    { label: "Manufacturer",     definition: "The company that manufactures this component" },
    { label: "Product Category", definition: "The product category or classification" },
    { label: "Unit Price",       definition: "The list price per unit including currency" },
    { label: "Stock Level",      definition: "Current units held in stock" },
    { label: "Lead Time",        definition: "Replenishment lead time from the manufacturer" },
    { label: "",                 definition: "" } // optional spare row for the UI
  ]
};
