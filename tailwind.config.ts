import { fontFamily } from "tailwindcss/defaultTheme";

import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        jakarta: ["Plus Jakarta Sans"],
        sans: ['"Plus Jakarta Sans"', ...fontFamily.sans],
      },
      screens: {},
      fontSize: {
        display_lg: ["3.25rem", "3.5rem"],
        display_sm: ["2.75rem", "3rem"],
        head_1: ["2.5rem", "3rem"],
        head_2: ["2.25rem", "2.75rem"],
        head_3: ["2rem", "2.5rem"],
        head_4: ["1.75rem", "2.25rem"],
        head_5: ["1.5rem", "2rem"],
        head_6: ["1.25rem", "1.75rem"],
        parag_lg: ["1.125rem", "1.75rem"],
        parag: ["1rem", "1.5rem"],
        parag_sm: ["0.875rem", "1.25rem"],
        parag_xs: ["0.755rem", "1.25rem"],
        label_lg: ["1rem", "1.5rem"],
        label: ["0.875rem", "1.25rem"],
        label_sm: ["0.75rem", "1rem"],
        label_xs: ["0.625rem", "0.875rem"],
      },
    },
  },
};
