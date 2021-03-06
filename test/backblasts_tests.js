var assert = require("chai").assert;
var bb = require("../src/backblasts.js").BackblastChecker;


describe('Backblasts Additional Data', function() {
  describe('getAdditionalData', function() {
    it('should parse out workout dates', function() {
      var content = "<li><strong>When:</strong>01/01/2016</li>";
      var result = bb.getAdditionalData(content, []);

        assert(result.date === "01/01/2016", "Should parse out date");
    });

    it('should parse out todays date if workout date not found', function() {
      var content = "<li><strong></li>";
      var result = bb.getAdditionalData(content, []);
        var date = new Date(result.date);
        var today = new Date();

      assert(date.toLocaleDateString() == today.toLocaleDateString(), "Should be equal to today");
    });
    it('should parse out pax count and list', function() {
      var content = "<li><strong>The PAX:</strong>Wingman</li>";
      var result = bb.getAdditionalData(content, []);
      assert(result.paxCount == 1, "Should parse out pax list");
      assert(result.paxList.indexOf("wingman") != -1, "Should parse out pax list");
    });

    it('should parse out pax count', function(){
        var content = "The PAX:</strong> The Once-ler, Waterfoot, Vida, Chin Music, Crayola, Bullwinkle (FNG), Hannibal, Knight Rider, MAD, Pele, Adobe, Smash, Balk, Fireman Ed, Marge, Lambeau, Torpedo, Goonie (QIC) </li>";
        var result = bb.getAdditionalData(content,[]);
        assert(result.paxList.length === 18, "Should find the number of Pax");
    });
    it('should parse out QIC', function() {
      var content = "<li><strong>QIC:</strong>Gears</li>";
      var result = bb.getAdditionalData(content, []);
      assert(result.paxCount == 1, "Should parse out pax list");
      assert(result.paxList.indexOf("gears") != -1, "Should parse out pax list");
    });
    it('should handle QIC in pax list and QIC field', function() {
      var content = "<li><strong>QIC:</strong>Gears</li>" +
        "<li><strong>The PAX:</strong>Wingman,  Gears</li>";
      var result = bb.getAdditionalData(content, []);
      assert(result.paxCount == 2, "Should parse out pax list");
      assert(result.paxList.indexOf("gears") != -1, "Should capture QIC as a PAX");
      assert(result.paxList.indexOf("wingman") != -1, "Should capture non-QIC as a PAX");
    });
    it('should handle multiple in QIC field with and', function() {
      var content = "<li><strong>QIC:</strong>Gears and Old Bay</li>" +
        "<li><strong>The PAX:</strong>Wingman,  Gears, Old Bay</li>";
      var result = bb.getAdditionalData(content, []);
      assert(result.paxCount == 3, "Should parse out pax list");
      assert(result.paxList.indexOf("gears") != -1, "Should capture QIC as a PAX");
      assert(result.paxList.indexOf("oldbay") != -1, "Should capture QIC as a PAX");
      assert(result.paxList.indexOf("wingman") != -1, "Should capture non-QIC as a PAX");
    });
    it('should handle multiple in QIC field with commas', function() {
      var content = "<li><strong>QIC:</strong>Zima, Bolt, Bing</li>" +
        "<li><strong>The PAX:</strong>Wingman,  Gears, Old Bay</li>";
      var result = bb.getAdditionalData(content, []);
      assert(result.paxCount == 6, "Should parse out pax list");
      assert(result.paxList.indexOf("zima") != -1, "Should capture QIC as a PAX");
      assert(result.paxList.indexOf("bolt") != -1, "Should capture QIC as a PAX");
      assert(result.paxList.indexOf("bing") != -1, "Should capture QIC as a PAX");
      assert(result.paxList.indexOf("wingman") != -1, "Should capture non-QIC as a PAX");
      assert(result.paxList.indexOf("gears") != -1, "Should capture non-QIC as a PAX");
      assert(result.paxList.indexOf("oldbay") != -1, "Should capture non-QIC as a PAX");
    });
    it('should handle handle common acronyms', function() {
      var content = "<li><strong>QIC:</strong>Gears(YHC)</li>" +
        "<li><strong>The PAX:</strong>Wingman (Respect), Bolt(QIC), Sharkbait (2.0)</li>";
      var result = bb.getAdditionalData(content, []);
      assert(result.paxCount == 4, "Should parse out pax list");
      assert(result.paxList.indexOf("bolt") != -1, "Should contain bolt");
      assert(result.paxList.indexOf("wingman") != -1, "Should contain wingman");
      assert(result.paxList.indexOf("gears") != -1, "Should contain gears");
      assert(result.paxList.indexOf("sharkbait") != -1, "Should contain sharkbait");
    });
  });
});
