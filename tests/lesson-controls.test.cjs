const assert=require("node:assert/strict");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");
const {test}=require("node:test");

const css=readFileSync(join(__dirname,"../lesson-journey.css"),"utf8");

function luminance(hex){
  const channels=hex.slice(1).match(/../g).map(channel=>{
    const value=parseInt(channel,16)/255;
    return value<=0.04045?value/12.92:((value+0.055)/1.055)**2.4;
  });
  return channels[0]*0.2126+channels[1]*0.7152+channels[2]*0.0722;
}

test("filled lesson controls keep contrasting text on hover without styling disabled controls",()=>{
  const rules=[...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  const rule=rules.find(([,selectors])=>selectors.includes("#practice-view .continue-button:hover"));
  assert.ok(rule,"filled hover rule must be scoped to the practice view to outrank its general button hover rule");
  assert.deepEqual(rule[1].trim().split(/,\s*/),[
    "#practice-view .continue-button:hover:not(:disabled)",
    "#practice-view .check-button:hover:not(:disabled)",
    "#practice-view .phase.current:hover:not(:disabled)"
  ]);
  assert.match(rule[2],/color:\s*#fff;/);
  const background=rule[2].match(/background:\s*(#[a-f\d]{6});/i)?.[1];
  assert.ok(background);
  const contrast=(luminance("#ffffff")+0.05)/(luminance(background)+0.05);
  assert.ok(contrast>=4.5,`hover text contrast is ${contrast.toFixed(2)}:1`);
});
