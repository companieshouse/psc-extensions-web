import fs from "fs";
import http from "http";
import https from "https";
import app from "./app";
import logger from "./lib/logger";

// start the HTTP server
const httpServer = http.createServer(app);
httpServer.listen(process.env.NODE_PORT, () => {
    console.log(`Server started at: ${process.env.NODE_HOSTNAME}:${process.env.NODE_PORT}`);
}).on("error", err => {
    logger.error(`HTTP Server error: ${err.message} - ${err.stack}`);
});

// Start the secure server - possibly not required if app is running behind a loadbalancer, with SSL termination
if (process.env.NODE_SSL_ENABLED === "ON") {
    const privateKey = fs.readFileSync(process.env.NODE_SSL_PRIVATE_KEY ?? "", "utf8");
    const certificate = fs.readFileSync(process.env.NODE_SSL_CERTIFICATE ?? "", "utf8");
    const credentials = { key: privateKey, cert: certificate };

    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(process.env.NODE_PORT_SSL, () => {
        console.log(`Secure server started at: ${process.env.NODE_HOSTNAME_SECURE}:${process.env.NODE_PORT_SSL}`);
    }).on("error", err => {
        logger.error(`HTTPS Server error: ${err.message} - ${err.stack}`);
    });
}

export default httpServer;
