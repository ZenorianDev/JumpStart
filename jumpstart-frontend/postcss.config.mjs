// postcss.config.mjs
import tailwindcss from "@tailwindcss/postcss";

export default {
  plugins: {
    [tailwindcss.name]: tailwindcss,
  },
};
