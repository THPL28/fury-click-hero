$body = Get-Content -Path 'test-request.json' -Raw
try {
  $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/jobs' -Method 'POST' -Body $body -ContentType 'application/json' -UseBasicParsing
  Write-Host "Success: Status $($response.StatusCode)"
  $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
  Write-Host "Error: $($_.Exception.Message)"
  if ($_.Exception.Response) {
    Write-Host "Response Status: $($_.Exception.Response.StatusCode)"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $reader.BaseStream.Position = 0
    $reader.DiscardBufferedData()
    $response_body = $reader.ReadToEnd()
    Write-Host "Response Body: $response_body"
    $response_body | ConvertFrom-Json | ConvertTo-Json -Depth 10
  }
}
