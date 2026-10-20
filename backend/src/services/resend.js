import "dotenv/config"

import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
    throw new Error("A variável RESEND_API_KEY não foi configurada.")
}

const resend = new Resend(process.env.RESEND_API_KEY)

export default resend