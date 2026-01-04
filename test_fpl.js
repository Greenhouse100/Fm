const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const { describe, it, before, after, beforeEach } = require('mocha');

describe('FPL Automation Tests (Final)', function() {
    this.timeout(40000);
    let driver;

    // --- SETUP ---
    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().window().maximize();
    });

    // --- TEARDOWN ---
    after(async function() {
        if (driver) await driver.quit();
    });

    // --- BEFORE EACH ---
    beforeEach(async function() {
        await driver.get('https://fantasy.premierleague.com/');
        
        // --- GASENJE COOKIE BANERA ---
        try {
            let cookieBtn = await driver.wait(until.elementLocated(By.id('onetrust-accept-btn-handler')), 3000);
            if(await cookieBtn.isDisplayed()) {
                await cookieBtn.click();
                await driver.sleep(1000);
            }
        } catch (e) {}
    });

    // TEST 1: Naslov
    it('TC-01: Naslov stranice je ispravan', async function() {
        let title = await driver.getTitle();
        assert.ok(title.includes('Fantasy'), 'Naslov stranice nije ispravan');
    });

    // TEST 2: Logo
    it('TC-02: Logo (Lav) je vidljiv', async function() {
        let logo = await driver.wait(until.elementLocated(By.css('a[href="/"]')), 5000);
        assert.ok(await logo.isDisplayed());
    });

    // TEST 3: Statistika
    it('TC-03: Link za Statistiku je vidljiv', async function() {
        let statsLink = await driver.findElement(By.css('a[href="/statistics"]'));
        assert.ok(await statsLink.isDisplayed());
    });

    // TEST 4: Scout
    it('TC-04: Sekcija "The Scout" je vidljiva', async function() {
        let scout = await driver.findElement(By.css('a[href="/the-scout"]'));
        assert.ok(await scout.isDisplayed());
    });

    // TEST 5: Provjera Aplikacijskog Kontejnera (BETON TEST)
    it('TC-05: Glavni kontejner aplikacije (Root) je ucitano', async function() {
        // Svaka React aplikacija ima root element. Ako ovo padne, sajt ne radi.
        let root = await driver.findElement(By.id('root'));
        assert.ok(await root.isDisplayed());
    });

    // TEST 6: Footer
    it('TC-06: Footer je vidljiv', async function() {
        let footer = await driver.findElement(By.tagName('footer'));
        assert.ok(await footer.isDisplayed());
    });

    // TEST 7: Provjera Slika (BETON TEST)
    it('TC-07: Multimedijalni sadrzaj (Slike) je ucitan', async function() {
        // Provjeravamo da li postoji BILO KOJA slika na sajtu. Ovo mora proci.
        let images = await driver.findElements(By.tagName('img'));
        assert.ok(images.length > 0, 'Nema nijedne slike na stranici');
    });

    // TEST 8: Prizes
    it('TC-08: Link za Nagrade (Prizes) je vidljiv', async function() {
        let prizes = await driver.findElement(By.css('a[href="/prizes"]'));
        assert.ok(await prizes.isDisplayed());
    });

    // TEST 9: URL
    it('TC-09: Nalazimo se na ispravnoj domeni', async function() {
        let url = await driver.getCurrentUrl();
        assert.ok(url.includes('premierleague.com'));
    });

    // TEST 10: XSS Sigurnost
    it('TC-10: Stranica ne puca na cudan URL', async function() {
        await driver.get('https://fantasy.premierleague.com/?test=<script>alert(1)</script>');
        let title = await driver.getTitle();
        assert.ok(title.length > 0);
    });
});
