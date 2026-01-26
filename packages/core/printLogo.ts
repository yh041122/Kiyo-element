export default function () {
  if (PROD) {
    const logo = `
_______________________________________________________________________________
 ____  __.__                ___________.__                                __   
|    |/ _|__|___.__. ____   \_   _____/|  |   ____   _____   ____   _____/  |_ 
|      < |  <   |  |/  _ \   |    __)_ |  | _/ __ \ /     \_/ __ \ /    \   __\
|    |  \|  |\___  (  <_> )  |        \|  |_\  ___/|  Y Y  \  ___/|   |  \  |  
|____|__ \__|/ ____|\____/  /_______  /|____/\___  >__|_|  /\___  >___|  /__|  
        \/   \/                     \/           \/      \/     \/     \/      
_______________________________________________________________________________
              
`;

    const rainbowGradient = `
background: linear-gradient(135deg, orange 60%, cyan);
background-clip: text;
color: transparent;
font-size: 16px; 
line-height: 1;
font-family: monospace;
font-weight: 600;
`;

    console.info(`%c${logo}`, rainbowGradient);
  } else if (DEV) {
    console.log("[KiyoElement]:dev mode...");
  }
}
