import { writable } from "svelte/store"

export const show_dialog = writable(false)
export const dialog_content = writable("")

export const show_create_app_modal = writable(true)
