import { createContext, useContext } from 'react'

export type AppContextValue = {
  /** true once the first-load preloader has finished */
  ready: boolean
  /** navigate with the curtain page transition */
  go: (to: string) => void
  /** open the enquiry modal, optionally for a specific project */
  openEnquiry: (project?: string) => void
}

export const AppContext = createContext<AppContextValue>({
  ready: true,
  go: () => {},
  openEnquiry: () => {},
})

export const useApp = () => useContext(AppContext)
