package com.poly.sport.util;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GHNService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String GHN_API_URL = "https://online-gateway.ghn.vn/shiip/public-api/master-data/";
    private static final String TOKEN = "650687b2-f5c1-11ef-9bc9-aecca9e2a07c";
    private static final int SHOP_ID = 2483458;

    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", TOKEN);
        headers.set("Content-Type", "application/json");
        headers.set("ShopId", String.valueOf(SHOP_ID));
        return headers;
    }

    public String getProvinceName(int provinceId) {
        try {
            String url = GHN_API_URL + "province";
            HttpEntity<String> entity = new HttpEntity<>(getHeaders());
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            for (JsonNode province : root.get("data")) {
                if (province.get("ProvinceID").asInt() == provinceId) {
                    return province.get("ProvinceName").asText();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Không xác định";
    }

    public String getDistrictName(int districtId) {
        try {
            String url = GHN_API_URL + "district";
            HttpEntity<String> entity = new HttpEntity<>(getHeaders());
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            for (JsonNode district : root.get("data")) {
                if (district.get("DistrictID").asInt() == districtId) {
                    return district.get("DistrictName").asText();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Không xác định";
    }

    public String getWardName(int districtId, String wardCode) {
        try {
            String url = GHN_API_URL + "ward?district_id=" + districtId;
            HttpEntity<String> entity = new HttpEntity<>(getHeaders());
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());

            for (JsonNode ward : root.get("data")) {
                if (ward.get("WardCode").asText().equals(wardCode)) {
                    return ward.get("WardName").asText();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Không xác định";
    }

}