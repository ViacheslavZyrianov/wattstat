import { ButtonType } from 'vant'

export interface DialogOptions {
  title?: string
  message?: string
  customClass?: string
  showCloseButton?: boolean

  confirmButtonText?: string
  confirmButtonType?: ButtonType
  showConfirmButton?: boolean
  confirmButtonColor?: string
  onConfirm?: () => void

  cancelButtonText?: string
  cancelButtonType?: ButtonType
  showCancelButton?: boolean
  cancelButtonColor?: string
  onCancel?: () => void
}
