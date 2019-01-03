import { createConnection } from 'typeorm'

async function main() {
  console.log(`process.env: ${JSON.stringify(process.env, null, 2)}`)
  try {
    const conn = await createConnection()
    console.log(`connectionOptions: ${JSON.stringify(conn.options, null, 2)}`)
  } catch (e) {
    console.error(e)
  } finally {
    process.exit(0)
  }
}

main()