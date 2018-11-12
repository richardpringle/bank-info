'use strict';

const request = require('r2');
const { spawn } = require('child_process');
// const pbcopy = spawn('pbcopy');
const fs = require('fs');

const ws = fs.createWriteStream('bank-branches.csv');
const fileWriter = new console.constructor(ws, ws);

dedupBankInfo();

function dedupBankInfo() {
  const rawInfo = require('./branch-info.json');
  const infoMap = new Map();
  const sortedInfo = [];

  rawInfo.forEach(item => {
    const code = item.institution + item.branch;
    if (infoMap.has(code)) return;

    infoMap.set(code, item);
  });

  Array.from(infoMap.keys()).sort().forEach(code => {
    sortedInfo.push(infoMap.get(code));
  });

  const newFilePath = './branch-info-processed.json'

  fs.writeFile(newFilePath, JSON.stringify(sortedInfo, null, '  '), () => {});
}

// getAndWriteAll(getBranches());

function writeCsvAddressLine(branchNumber, address) { 
  const csvLine =
    `"${branchNumber.slice(0, 3)}",` +
    `"${branchNumber.slice(3)}",` +
    `"${address.trim()}"`;
  console.log(csvLine)
  // return fileWriter.log(csvLine);
} 

async function getAndWriteOne(branchNumber) {
  await request.get(buildUrl(branchNumber)).response
    .then(async res => {
      const count = counter();
      let body = '';

      const pbcopy = spawn('pbcopy');
      res.body.pipe(pbcopy.stdin);
      
      res.body.once('data', data => {
        count.next();
        res.body.end()
        body += data;
      });

      res.body.on('end', () => {
        const stringToWrite = scrapeBranchMeta(body, branchNumber);
        return writeCsvAddressLine(branchNumber, stringToWrite);
      });
    });
}

async function getAndWriteAll(branchNumbers) {
  for (const branchNumber of branchNumbers) {
    await getAndWriteOne(branchNumber);
  }
}

function buildUrl(bankNumber) {
  const [, institution, branch] = bankNumber.match(/([0-9]{3})([0-9]{5})/);
  return 'http://canada-banks-info.com/routing-numbers/' +
    'royal-trust-corporation-of-canada-routing-numbers/' +
    `${branch}-${institution}/`;
}

function * counter() {
  let count = 1;
  while (1) {
    yield count++;
  }
}

function scrapeBranchMeta(body, branchNumber) {
  const [matchMeta, $1] =
    /<meta.name="description"[\s\S]*content="([^"]*)">/gim.exec(body) ||
    [null, ''];

  let [matchBranch, branchName] =
    /branch[ |]*:[ |]*(.*[^\s,\.])/i.exec($1) ||
    [null, ''];

  let [matchAddress, address] =
    /address[ |]*:[ |]*(.*[^\s,\.])/i.exec($1) ||
    [null, ''];

  if (!address) {
    const err = new Error(branchNumber);
    console.error(branchName);
    throw err;
  }

  if (address.includes(branchName)) branchName = '';
  if (/[0-9]*/.test(branchName)) {
    address = `${branchName} ${address}`;
    branchName = '';
  }

  return branchName ? `${branchName}, ${address}` : address; 
}

// just to put the array at the bottom of the file instead of putting it in a 
// separate file
function getBranches() {
  // return ['00300236'];
  return [
    '00109980',
    '00110221',
    '00123402',
    '00123532',
    '00123612',
    '00139330',
    '00300002',
    '00300114',
    '00300236',
    '00300445',
    '00300934',
    '00301082',
    '00301312',
    '00301434',
    '00301762',
    '00301822',
    '00301872',
    '00301922',
    '00301942',
    '00301952',
    '00302162',
    '00302722',
    '00302874',
    '00303404',
    '00303638',
    '00304958',
    '00305092',
    '00305178',
    '00305204',
    '00305261',
    '00305288',
    '00305341',
    '00305572',
    '00305714',
    '00306012',
    '00306142',
    '00306176',
    '00306702',
    '00306722',
    '00307373',
    '00307818',
    '00308002',
    '00308538',
    '00308918',
    '00419682',
    '00434482',
    '00460647',
    '00600221',
    '00600261',
    '00600381',
    '00600441',
    '00600451',
    '00600491',
    '00600701',
    '00600791',
    '00600851',
    '00600891',
    '00600981',
    '00601071',
    '00601081',
    '00601101',
    '00601141',
    '00601311',
    '00601351',
    '00601371',
    '00601591',
    '00601711',
    '00601761',
    '00601821',
    '00601861',
    '00601921',
    '00601971',
    '00602091',
    '00602111',
    '00602121',
    '00602221',
    '00602291',
    '00602351',
    '00602391',
    '00602421',
    '00602551',
    '00602671',
    '00602691',
    '00602731',
    '00602961',
    '00602971',
    '00603891',
    '00604081',
    '00604271',
    '00604431',
    '00604501',
    '00604721',
    '00604801',
    '00606021',
    '00606071',
    '00606091',
    '00606211',
    '00606221',
    '00606291',
    '00606361',
    '00606371',
    '00606471',
    '00606571',
    '00606751',
    '00606771',
    '00606781',
    '00606801',
    '00606811',
    '00606831',
    '00606841',
    '00606851',
    '00606871',
    '00607101',
    '00607111',
    '00607121',
    '00607131',
    '00607141',
    '00607661',
    '00607701',
    '00607711',
    '00607721',
    '00607731',
    '00607741',
    '00607751',
    '00607761',
    '00607771',
    '00608911',
    '00609341',
    '00609371',
    '00609451',
    '00609501',
    '00609511',
    '00609521',
    '00609531',
    '00609541',
    '00609551',
    '00609561',
    '00609571',
    '00609581',
    '00609591',
    '00609911',
    '00609951',
    '00609971',
    '00610351',
    '00610421',
    '00610861',
    '00610871',
    '00611141',
    '00611341',
    '00611381',
    '00611501',
    '00611521',
    '00611661',
    '00611741',
    '00611751',
    '00611781',
    '00611941',
    '00611951',
    '00612031',
    '00612161',
    '00612211',
    '00612341',
    '00612601',
    '00612611',
    '00612721',
    '00612821',
    '00613371',
    '00613511',
    '00613521',
    '00613581',
    '00613641',
    '00613681',
    '00613701',
    '00614191',
    '00614641',
    '00619141',
    '01000002',
    '01000004',
    '01000028',
    '01000039',
    '01000047',
    '01000059',
    '01000060',
    '01000067',
    '01000068',
    '01000080',
    '01000083',
    '01000107',
    '01000122',
    '01000132',
    '01000209',
    '01000260',
    '01000271',
    '01000302',
    '01000319',
    '01000329',
    '01000339',
    '01000363',
    '01000370',
    '01000449',
    '01000450',
    '01000479',
    '01000492',
    '01000497',
    '01000500',
    '01000573',
    '01000600',
    '01000642',
    '01000739',
    '01000902',
    '01000919',
    '01001018',
    '01001072',
    '01001138',
    '01001331',
    '01001732',
    '01001742',
    '01001800',
    '01001902',
    '01002040',
    '01002099',
    '01002642',
    '01002769',
    '01003000',
    '01003022',
    '01003552',
    '01003892',
    '01003999',
    '01004959',
    '01005008',
    '01005252',
    '01005652',
    '01006042',
    '01007040',
    '01007672',
    '01008089',
    '01008542',
    '01008732',
    '01008910',
    '01009812',
    '01610930',
    '03900301',
    '03900771',
    '03901181',
    '03904221',
    '03905311',
    '23900062',
    '23900122',
    '23900276',
    '81580001',
    '81580012',
    '81592154',
    // '81900267',
    '81900967',
    '82802562',
    '82806222',
    '82806322',
    '82817102',
    '82821962',
    '82862212',
    '82862302',
    '82900303',
    '83400012',
    '83700282',
    '83700612',
    '83700622',
    '83700632',
    '83700642',
    '83700652',
    '83700662',
    '83700672',
    '83700682',
    '83700692',
    '83700702',
    '83700712',
    '83700742',
    '83700782',
    '83700792',
    '83700802',
    '83762022',
    '83907013',
    '83933373',
    '83963503',
    '84200646',
    '86500484',
    '87900317',
    '87900737',
    '87952407',
    '88903178',
    '88912468',
    '88952688',
    '88953538',
    '88992478',
    '89013352',
    '89901849',
  ];
}