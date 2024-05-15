#!/bin/bash
# bin/load_env.sh

export XSA_APPLICATION_NAME=$(echo "$VCAP_APPLICATION" | python3 -c "import sys, json; print(json.load(sys.stdin)['application_name'])")
echo 'application_name:' ${XSA_APPLICATION_NAME}
export XSA_ORGANIZATION_NAME=$(echo "$VCAP_APPLICATION" | python3 -c "import sys, json; print(json.load(sys.stdin)['organization_name'])")
echo 'organization_name:' ${XSA_ORGANIZATION_NAME}
export XSA_SPACE_NAME=$(echo "$VCAP_APPLICATION" | python3 -c "import sys, json; print(json.load(sys.stdin)['space_name'])")
echo 'space_name:' ${XSA_SPACE_NAME}

export XSA_APPLICATION_ID=$(echo "$VCAP_APPLICATION" | python3 -c "import sys, json; print(json.load(sys.stdin)['application_id'])")
echo 'application_id:' ${XSA_APPLICATION_ID}
export XSA_SPACE_ID=$(echo "$VCAP_APPLICATION" | python3 -c "import sys, json; print(json.load(sys.stdin)['space_id'])")
echo 'space_id:' ${XSA_SPACE_ID}
export XSA_INSTANCE_ID=$(echo "$VCAP_APPLICATION" | python3 -c "import sys, json; print(json.load(sys.stdin)['instance_id'])")
echo 'instance_id:' ${XSA_INSTANCE_ID}

if [ -f docker.container ]
then
	export XSA_APPLICATION_DOCKER_IMAGE=$(cat docker.container | python3 -c "import sys, json; print(json.load(sys.stdin)['docker_image'])")
	echo 'docker_container:' ${XSA_APPLICATION_DOCKER_IMAGE}
	export XSA_APPLICATION_DOCKER_PORT=$(cat docker.container | python3 -c "import sys, json; print(json.load(sys.stdin)['docker_port'])")
	echo 'docker_port:' ${XSA_APPLICATION_DOCKER_PORT}
	export DOCKER_ARG=$(cat docker.container | python3 -c "import sys, json; print(json.load(sys.stdin)['docker_arg'])")
	echo 'docker_arg:' ${DOCKER_ARG}
        export DOCKER_IMAGE_CMD=$(cat docker.container | python3 -c "import sys, json; print(json.load(sys.stdin)['docker_image_cmd'])")
        echo 'docker_image_cmd:' ${DOCKER_IMAGE_CMD}
fi
