#!/bin/bash
#
# Start script for PSC extensions web

PORT=3000

export NODE_PORT=${PORT}
exec node -r ./otel.js httpServer.js -- ${PORT}
