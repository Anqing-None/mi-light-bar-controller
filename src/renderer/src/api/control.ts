// https://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf
const { execCommand } = window.api;

interface Command {
  id: number;
  method: string;
  params: (string | number)[];
}

export async function getInitState() {
  const command: Command = {
    id: 1,
    method: 'get_prop',
    params: ['power', 'bright', 'CT'],
  };

  return await execCommand(command);
}

export async function setPower(state: 'on' | 'off') {
  const command: Command = {
    id: 2,
    method: 'set_power',
    params: [state],
  };

  return await execCommand(command);
}

export async function setBright(bright: number) {
  const command: Command = {
    id: 3,
    method: 'set_bright',
    params: [bright, 'smooth', 500],
  };

  return await execCommand(command);
}

export async function set_CT(CT: number) {
  const command: Command = {
    id: 4,
    method: 'set_ct_abx',
    params: [CT, 'smooth', 500],
  };

  return await execCommand(command);
}
