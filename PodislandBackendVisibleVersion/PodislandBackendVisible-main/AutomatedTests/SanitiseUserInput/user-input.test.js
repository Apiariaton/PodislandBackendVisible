const sanitiseTextField = require("../../SanitiseUserInput/sanitiseTextField");
//const bowdleriseTextField = require("../../SanitiseUserInput/bowdleriseTextField");
const SanitiseUserInput = require("../../SanitiseUserInput/SanitiseInput");
const bowdleriseTextField = require("../../SanitiseUserInput/bowdleriseTextField");

//sanitiseTextField tests
test('Accepts a valid email - frog55@gmail.com',()=>{
expect(sanitiseTextField("frog55@gmail.com")).toBe("frog55@gmail.com");
}
);


test('Rejects a script tag', ()=>{
expect(sanitiseTextField("<script> frog55@gmail.com </script>")).toBe(null);
}
);


test('Rejects an embedded function',()=>{
expect(sanitiseTextField("<button onclick={()=>{alert('danger')}}></button>")).toBe(null);
}
);

// //bowdleriseTextField tests
test('Accepts non-toxic text input',async ()=>{
expect(await bowdleriseTextField("Dandy")).toBe("Dandy");
});


// 
test('Rejects toxic text input',async ()=>{
    expect(await bowdleriseTextField("Total shit")).toBe(null);
    });



// );


// test(



// );

// //SanitiseUserInput tests
test("Accepts a valid username", async () => {
    const sanitiser = new SanitiseUserInput();
    const sanitizedInput = await sanitiser.cleanText("Aladdin55");
    expect(sanitizedInput).toEqual("Aladdin55");
  });
    

test("Rejects a toxic username", async ()=>{
const sanitiser = new SanitiseUserInput();
const sanitisedInput = await sanitiser.cleanText("ShitStorm")
expect(sanitisedInput).toEqual(null);
});


test("Rejects a malicious input", async ()=>{
    const sanitiser = new SanitiseUserInput();
    const sanitisedInput = await sanitiser.cleanText("<button onclick='()=>{nefariousfn()}'>Harmless Button</button>")
    expect(sanitisedInput).toEqual("Harmless Button");    
});

// );

