/* eslint-disable @typescript-eslint/no-require-imports */
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@opentelemetry/sdk-node", () => {
    return {
        NodeSDK: jest.fn().mockImplementation(() => ({
            start: jest.fn(),
        })),
    };
});

jest.mock("../src/open-telemetry/openTelemetryConfig", () => ({
    otel: {
        traceExporterUrl: "http://localhost:4318/v1/traces",
        metricsExporterUrl: "http://localhost:4318/v1/metrics",
        otelLogEnabled: true,
    },
}));

describe("otel.ts", () => {
    let NodeSDK: jest.Mock;
    let sdkStartMock: jest.Mock;
    let consoleInfoMock: jest.Mock;
    let consoleErrorMock: jest.Mock;

    beforeEach(() => {
        jest.resetModules(); // Reset module registry to ensure fresh imports

        NodeSDK = require("@opentelemetry/sdk-node").NodeSDK;
        sdkStartMock = jest.fn();
        NodeSDK.mockImplementation(() => ({ start: sdkStartMock }));

        consoleInfoMock = jest.fn();
        consoleErrorMock = jest.fn();
        console.info = consoleInfoMock;
        console.error = consoleErrorMock;
    });

    it("should start the SDK successfully when otelLogEnabled is true", () => {
        require("../src/otel");

        expect(consoleInfoMock).toHaveBeenCalledWith("Starting OpenTelemetry SDK...");
        expect(sdkStartMock).toHaveBeenCalled();
        expect(consoleInfoMock).toHaveBeenCalledWith("OpenTelemetry SDK started successfully.");
    });

    it("should log an error when SDK fails to start", () => {
        const error = new Error("Failed to start");
        sdkStartMock.mockImplementation(() => {
            throw error;
        });

        require("../src/otel");

        expect(consoleInfoMock).toHaveBeenCalledWith("Starting OpenTelemetry SDK...");
        expect(sdkStartMock).toHaveBeenCalled();
        expect(consoleErrorMock).toHaveBeenCalledWith("Failed to start OpenTelemetry SDK:", error);
    });

    it("should not start the SDK when otelLogEnabled is false", () => {
        const openTelemetryConfig = require("../src/open-telemetry/openTelemetryConfig");
        openTelemetryConfig.otel.otelLogEnabled = false;

        require("../src/otel");

        expect(consoleInfoMock).not.toHaveBeenCalledWith("Starting OpenTelemetry SDK...");
        expect(sdkStartMock).not.toHaveBeenCalled();
    });
});