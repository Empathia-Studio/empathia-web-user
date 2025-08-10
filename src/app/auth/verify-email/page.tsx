import VerifyEmail from "../../../features/auth/components/VerifyEmail";
import { Suspense } from 'react'
const Page = () => {
  return (
    <Suspense>
    <VerifyEmail />
  </Suspense>
  )
}

export default Page;