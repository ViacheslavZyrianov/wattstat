import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          background: '#EEEEEE',
        },
      },
      dark: {
        colors: {
          background: '#121212',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      variant: 'elevated',
      class: 'text-subtitle-2',
    },
    VTextField: {
      density: 'compact',
      variant: 'outlined',
      class: 'text-caption',
    },
    VDateInput: {
      density: 'compact',
      variant: 'outlined',
      class: 'text-caption',
    },
    VCard: {
      class: 'pa-4',
    },
    VBottomNavigation: {
      VBtn: {
        class: 'text-caption min-w-0 px-2',
        VIcon: {
          size: 'large',
        },
      },
    },
    VDatePicker: {
      firstDayOfWeek: 1, // Start week on Monday
    },
  },
})
