ARG IMAGE_VERSION="latest"
FROM 416670754337.dkr.ecr.eu-west-2.amazonaws.com/ci-node-runtime-20:${IMAGE_VERSION} 

WORKDIR /opt
COPY /app .
COPY docker_start.sh .

RUN chmod +x docker_start.sh
CMD ["./docker_start.sh"]
